import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogPhuongAnTrinhTongCucComponent } from 'src/app/components/dialog/dialog-phuong-an-trinh-tong-cuc/dialog-phuong-an-trinh-tong-cuc.component';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau, FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { ThongTinQuyetDinhPheDuyetKHLCNT } from 'src/app/models/ThongTinQuyetDinhPheDuyetKHLCNT';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, convertVthhToId } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-themmoi-quyetdinh-khlcnt',
  templateUrl: './themmoi-quyetdinh-khlcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-khlcnt.component.scss']
})
export class ThemmoiQuyetdinhKhlcntComponent implements OnInit {

  @Input() loaiVthh: string
  @Input() id: number = 0;
  @Output()
  showListEvent = new EventEmitter<any>();

  // isVisibleChangeTab$ = new Subject();
  // visibleTab: boolean = false;
  formData: FormGroup;
  formThongTinDX: FormGroup;
  formThongTinChung: FormGroup;

  editId: string | null = null;
  chiTiet: ThongTinQuyetDinhPheDuyetKHLCNT = new ThongTinQuyetDinhPheDuyetKHLCNT();
  // id: number;
  selectedCanCu: any = {};
  selectedPhuongAn: any = {};
  idTongHop: number
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: "" };
  errorInputRequired: string = null;
  errorGhiChu: boolean = false;
  maQd: string = null;
  fileDinhKem: Array<FileDinhKem> = [];


  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listVatTuHangHoa: any[] = [];
  fileList: any[] = [];
  listDanhSachTongHop: any[] = [];
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-gateway/qlnv-core/file/upload-attachment`;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'phe-duyet';
  danhMucDonVi: any;
  danhsachDx: any[] = [
    {
      id: 1,
      soGthau: 3,
    }
  ];
  iconButtonDuyet: string;
  titleButtonDuyet: string;
  titleStatus: string;

  listNam: any[] = [];
  yearNow: number = 0;

  listOfOption: any[] = [
    {
      label: 'a',
      value: 1
    }, {
      label: 'b',
      value: 2
    }, {
      label: 'c',
      value: 3
    },
  ]

  listOfData: DanhSachGoiThau[] = [];
  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};

  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    public userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private dauThauService: DanhSachDauThauService,
    private uploadFileService: UploadFileService,
    public globals: Globals,
  ) {
    this.formData = this.fb.group({
      id: [null],
      soQdCc: ['', [Validators.required]],
      soQd: ['', [Validators.required]],
      ngayQd: ['', [Validators.required]],
      idThHdr: ['', [Validators.required]],
      veViec: [''],
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      tgianPhanh: ['', [Validators.required]],
      tgianTbao: ['', [Validators.required]],
      tgianDthau: ['', [Validators.required]],
      tgianMthau: ['', [Validators.required]],
      tgianNhang: ['', [Validators.required]],
      ghiChu: ['', Validators.required],
      loaiVthh: [''],
      namKhoach: [''],
      trangThai: [''],
      namKeHoach: [''],
    })
    this.formThongTinDX = this.fb.group({
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      tgianPhanh: ['', [Validators.required]],
      tgianTbao: ['', [Validators.required]],
      tgianDthau: ['', [Validators.required]],
      tgianMthau: ['', [Validators.required]],
      tgianNhang: ['', [Validators.required]]
    })
    this.danhMucDonVi = JSON.parse(sessionStorage.getItem('danhMucDonVi'));
    this.formThongTinChung = this.fb.group(
      {
        id: [],
        tenDuAn: [null, [Validators.required]],
        tenDvi: [null],
        tongMucDt: [null, [Validators.required]],
        nguonVon: [null, [Validators.required]],
        tchuanCluong: [null, [Validators.required]],
        loaiHdong: [null, [Validators.required]],
        hthucLcnt: [null, [Validators.required]],
        pthucLcnt: [null, [Validators.required]],
        donGia: [null, [Validators.required]],
        tgianTbao: [null, [Validators.required]],
        tgianPhatHanh: [null, [Validators.required]],
        tgianMoThau: [null, [Validators.required]],
        tgianDongThau: [null, [Validators.required]],
        tgianThHienHd: [null, [Validators.required]],
        tgianNhapHang: [null, [Validators.required]],
        maDvi: [null]
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
      this.chiTiet.children1 = [];
      this.maQd = this.userInfo.MA_QD;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await Promise.all([
        this.loaiHangDTQGGetAll(),
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        this.loadChiTiet(this.id),
        this.danhSachTongHopGetAll(),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  collapse2(array: DanhSachGoiThau[], data: DanhSachGoiThau, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.idVirtual === d.idVirtual)!;
          target.expand = false;
          this.collapse2(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  selectNam() {
    this.yearNow = this.formData.get('namKeHoach').value;
  }

  openDialogQuyetDinhGiaoChiTieu() {
    let tt = this.formData.get('trangThai').value;
    if (tt == '01' || tt == '11') {
      return;
    }
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
      nzContent: DialogQuyetDinhGiaoChiTieuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.selectedCanCu = data;
        this.formData.patchValue({
          soQdCc: this.selectedCanCu.soQuyetDinh
        })
      }
    });
  }

  openDialogPhuongAnTrinhTongCuc() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin phương án trình tổng cục',
      nzContent: DialogPhuongAnTrinhTongCucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1100px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.selectedPhuongAn = data;
      }
    });
  }

  displayDialogPhuLuc(data: any): void {
    this.modal.create({
      nzTitle: 'Thông tin phụ lục KH LNCT cho các Cục DTNN KV',
      nzContent: DialogThongTinPhuLucQuyetDinhPheDuyetComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
  }


  getListFile(data: any) {
    if (!this.fileList) {
      this.fileList = [];
    }
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let item = {
          uid: 'fileOld_' + i.toString(),
          name: data[i].fileName,
          status: 'done',
          url: data[i].fileUrl,
          size: data[i].fileSize ? parseFloat(data[i].fileSize.replace('KB', '')) * 1024 : 0,
          id: data[i].id,
        };
        this.fileList.push(item);
      }
    }
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      if (info.file.response) {
        let fileList = [...info.fileList];
        fileList = fileList.map(file => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });
        this.fileList = [];
        for (let i = 0; i < fileList.length; i++) {
          let item = {
            uid: fileList[i].uid ?? 'fileNew_' + i.toString(),
            name: fileList[i].name,
            status: 'done',
            url: fileList[i].url,
            size: fileList[i].size,
            id: fileList[i].id,
          };
          this.fileList.push(item);
        }
      }
    } else if (info.file.status === 'error') {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  xoaFile(data) {
    this.fileList = this.fileList.filter(x => x.uid != data.uid);
  }

  loadDanhMucHang() {
    this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        this.listOfMapData = hangHoa.data;
        this.listOfMapDataClone = [...this.listOfMapData];
        this.listOfMapData.forEach((item) => {
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });
      }
    });
  }

  async loaiHangDTQGGetAll() {
    this.listVatTuHangHoa = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVatTuHangHoa = res.data;
    }
  }

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }

  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  async danhSachTongHopGetAll() {
    this.listDanhSachTongHop = [];
    let loatVthh = this.router.url.split('/')[4]
    let body = {
      trangThai: "00",
      loaiVthh: convertVthhToId(loatVthh)
    }
    let res = await this.tongHopDeXuatKHLCNTService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = res.data;
    }
  }

  async openDialogDeXuat(index) {
    let data = this.danhsachDx[index]
    this.modal.create({
      nzTitle: '',
      nzContent: DialogThongTinPhuLucQuyetDinhPheDuyetComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '90%',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
  }

  deleteItem(index) {
    this.danhsachDx = this.danhsachDx.filter((item, i) => i !== index)
  }

  convertTreeToList(root: VatTu): VatTu[] {
    const stack: VatTu[] = [];
    const array: VatTu[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({
            ...node.child[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }
    return array;
  }

  visitNode(
    node: VatTu,
    hashMap: { [id: string]: boolean },
    array: VatTu[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  selectMaTongHop(event) {
    let data = this.listDanhSachTongHop.filter(item => item.id == event);
    if (data.length > 0) {
      this.bindingData(data[0]);
    }
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + "/" + this.maQd;
    body.detail = this.danhsachDx;
    body.fileDinhKems = this.fileDinhKem;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.loadChiTiet(res.data.id)
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDo: text,
            trangThai: '03',
          };
          const res = await this.quyetDinhPheDuyetKeHoachLCNTService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            let loatVthh = this.router.url.split('/')[4]
            this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + loatVthh + '/phe-duyet']);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    let trangThai = ''
    let mesg = ''
    switch (this.formData.get('trangThai').value) {
      case '00':
      case '03': {
        trangThai = '01';
        mesg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case '01': {
        trangThai = '11';
        mesg = 'Văn bản sẵn sàng ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mesg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            "id": this.id,
            "trangThai": trangThai
          }
          let res = await this.quyetDinhPheDuyetKeHoachLCNTService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.loadChiTiet(res.data.id);
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TRINH_DUYET_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  getTenDviTable(maDvi: string) {
    let donVi = this.danhMucDonVi?.filter(item => item.maDvi == maDvi);
    return donVi.length > 0 ? donVi[0].tenDvi : null
  }

  setTitle() {
    let trangThai = this.formData.get('trangThai').value
    switch (trangThai) {
      case '00': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        break;
      }
      case '03': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        break;
      }
      case '01': {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet'
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Lãnh đạo duyệt';
        break
      }
      case '11': {
        this.titleStatus = 'Ban hành';
        break
      }
    }
  }

  async bindingData(data) {
    console.log(data);
    this.formThongTinDX.patchValue({
      loaiHdong: data.loaiHdong,
      pthucLcnt: data.pthucLcnt,
      hthucLcnt: data.hthucLcnt,
      nguonVon: data.nguonVon,
      tgianPhanh: [data.tuTgianPhanh, data.denTgianPhanh],
      tgianTbao: [data.tuTgianTbao, data.denTgianTbao],
      tgianDthau: [data.tuTgianDthau, data.denTgianDthau],
      tgianMthau: [data.tuTgianMthau, data.denTgianMthau],
      tgianNhang: [data.tuTgianNhang, data.denTgianNhang],
    });
    this.formData.patchValue({
      loaiHdong: data.loaiHdong,
      pthucLcnt: data.pthucLcnt,
      hthucLcnt: data.hthucLcnt,
      nguonVon: data.nguonVon,
      tgianPhanh: data.tuTgianPhanh,
      tgianTbao: data.tuTgianTbao,
      tgianDthau: data.tuTgianDthau,
      tgianMthau: data.tuTgianMthau,
      tgianNhang: data.tuTgianNhang,
      loaiVthh: data.loaiVthh,
      namKhoach: data.namKhoach
    })
    this.danhsachDx = data.children;
    this.danhsachDx.forEach(async (item, index) => {
      await this.dauThauService.getDetail(item.idDxHdr).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          item.children = res.data.children2;
        }
      })
    })
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  searchHangHoa(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.listOfMapData = this.listOfMapDataClone;
    } else {
      this.listOfMapData = this.listOfMapDataClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  selectHangHoa(vatTu: any) {
    this.selectHang = vatTu;
    this.chiTiet.loaiVthh = this.selectHang.ma
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.chiTiet(id);
      let data = res.data;
      this.formData.patchValue({
        id: data.id,
        soQdCc: data.soQdCc,
        soQd: data.soQd,
        ngayQd: data.ngayQd,
        idThHdr: data.idThHdr,
        veViec: data.veViec,
        loaiHdong: data.loaiHdong,
        pthucLcnt: data.pthucLcnt,
        hthucLcnt: data.hthucLcnt,
        nguonVon: data.nguonVon,
        tgianPhanh: data.tgianPhanh,
        tgianTbao: data.tgianTbao,
        tgianDthau: data.tgianDthau,
        tgianMthau: data.tgianMthau,
        tgianNhang: data.tgianNhang,
        loaiVthh: data.loaiVthh,
        namKhoach: data.namKhoach,
        ghiChu: data.ghiChu,
        trangThai: data.trangThai
      })
      this.danhsachDx = data.children1;
      let dataDX = await this.tongHopDeXuatKHLCNTService.getDetail(data.idThHdr);
      let obj = this.listDanhSachTongHop.filter(item => item.id === data.idThHdr);
      this.listDanhSachTongHop = [
        ...this.listDanhSachTongHop,
        dataDX.data
      ]
      this.formThongTinDX.patchValue({
        loaiHdong: dataDX.data.loaiHdong,
        pthucLcnt: dataDX.data.pthucLcnt,
        hthucLcnt: dataDX.data.hthucLcnt,
        nguonVon: dataDX.data.nguonVon,
        tgianPhanh: [dataDX.data.tuTgianTbao, dataDX.data.denTgianTbao],
        tgianTbao: [dataDX.data.tuTgianTbao, dataDX.data.denTgianTbao],
        tgianDthau: [dataDX.data.tuTgianDthau, dataDX.data.denTgianDthau],
        tgianMthau: [dataDX.data.tuTgianMthau, dataDX.data.denTgianMthau],
        tgianNhang: [dataDX.data.tuTgianNhang, dataDX.data.denTgianNhang],
      });
    };
    this.setTitle();
  }

  taiLieuDinhKem(type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới căn cứ xác định giá',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        this.uploadFileService
          .uploadFile(res.file, res.tenTaiLieu)
          .then((resUpload) => {
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            this.fileDinhKem.push(fileDinhKem);
          });
      }
    });
  }

  deleteTaiLieu(index: number) {
    this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index)
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.LANH_DAO_DUYET ||
      trangThai === this.globals.prop.TU_CHOI ||
      trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === this.globals.prop.BAN_HANH) {
      return 'da-ban-hanh';
    }
  }
}
