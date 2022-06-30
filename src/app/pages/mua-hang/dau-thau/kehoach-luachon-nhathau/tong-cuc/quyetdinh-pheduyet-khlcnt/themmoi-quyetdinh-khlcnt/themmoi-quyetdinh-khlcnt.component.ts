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
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau, FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
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
  @Input() idInput: number = 0;
  @Input() dataTongHop: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  // isVisibleChangeTab$ = new Subject();
  // visibleTab: boolean = false;
  formData: FormGroup;
  formThongTinDX: FormGroup;
  formThongTinChung: FormGroup;

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

  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  titleStatus: string = 'Dự thảo';

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

  danhMucDonVi: any;
  danhsachDx: any[] = [];

  iconButtonDuyet: string;
  titleButtonDuyet: string;

  listNam: any[] = [];
  yearNow: number = 0;

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
      soQd: ['', [Validators.required]],
      ngayQd: ['', [Validators.required]],
      ngayHluc: ['', [Validators.required]],
      idThHdr: ['', [Validators.required]],
      trichYeu: [''],
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      tgianBdauTchuc: ['', [Validators.required]],
      tgianDthau: ['', [Validators.required]],
      tgianMthau: ['', [Validators.required]],
      tgianNhang: ['', [Validators.required]],
      ghiChu: ['', Validators.required],
      loaiVthh: ['', Validators.required],
      tenVthh: ['', Validators.required],
      cloaiVthh: ['', Validators.required],
      tenCloaiVthh: ['', Validators.required],
      namKhoach: [dayjs().get('year'), Validators.required],
      trangThai: [''],
      tchuanCluong: ['']
    })
    this.formThongTinDX = this.fb.group({
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      tgianBdauTchuc: ['', [Validators.required]],
      tgianDthau: ['', [Validators.required]],
      tgianMthau: ['', [Validators.required]],
      tgianNhang: ['', [Validators.required]]
    })
    this.formThongTinChung = this.fb.group(
      {
        tenDuAn: [null, [Validators.required]],
        tenDvi: [null],
        tongMucDt: [null, [Validators.required]],
        nguonVon: [null, [Validators.required]],
        tchuanCluong: [null, [Validators.required]],
        loaiHdong: [null, [Validators.required]],
        hthucLcnt: [null, [Validators.required]],
        pthucLcnt: [null, [Validators.required]],
        donGia: [null, [Validators.required]],
        tgianBdauTchuc: [null, [Validators.required]],
        tgianMthau: [null, [Validators.required]],
        tgianDthau: [null, [Validators.required]],
        tgianNhang: [null, [Validators.required]],
        maDvi: [null]
      }
    );
    this.formData.controls['idThHdr'].valueChanges.subscribe(value => {
      if (value) {
        this.selectMaTongHop(value);
      }
    });
    this.formData.controls['tenVthh'].valueChanges.subscribe(value => {
      if (value) {
        this.danhSachTongHopGetAll();
      }
    });
    this.formData.controls['tenCloaiVthh'].valueChanges.subscribe(value => {
      if (value) {
        this.danhSachTongHopGetAll();
      }
    });
    this.formData.controls['namKhoach'].valueChanges.subscribe(value => {
      if (value) {
        this.danhSachTongHopGetAll();
      }
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
      this.maQd = this.userInfo.MA_QD;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      if (this.idInput > 0) {
        this.loadChiTiet(this.idInput)
      } else {
        this.firstInitUpdate = false;
      }
      await Promise.all([
        this.loaiHangDTQGGetAll(),
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        this.bindingDataTongHop(this.dataTongHop)
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenVthh: dataTongHop.tenVthh,
        namKhoach: dataTongHop.namKhoach,
        idThHdr: dataTongHop.id,
        tchuanCluong: dataTongHop.tchuanCluong
      })
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
    // this.listDanhSachTongHop = [];
    let body = {
      trangThai: "00",
      loaiVthh: this.formData.get('loaiVthh').value,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      namKhoach: this.formData.get('namKhoach').value
    }
    let res = await this.tongHopDeXuatKHLCNTService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = [...this.listDanhSachTongHop, ...res.data];
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

  async selectMaTongHop(event) {
    const res = await this.tongHopDeXuatKHLCNTService.getDetail(event)
    this.bindingData(res.data);
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log(this.formData.value);
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + "/" + this.maQd;
    body.dsDeXuat = this.danhsachDx;
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
        this.quayLai()
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.quayLai()
      }
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
            id: this.idInput,
            lyDo: text,
            trangThai: '03',
          };
          const res = await this.quyetDinhPheDuyetKeHoachLCNTService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai()
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
    if (this.formData.get('loaiVthh').value == "02") {
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
    } else {
      switch (this.formData.get('trangThai').value) {
        case '00': {
          trangThai = '11';
          mesg = 'Văn bản sẵn sàng ban hành ?'
          break;
        }
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
            "id": this.idInput,
            "trangThai": trangThai
          }
          let res = await this.quyetDinhPheDuyetKeHoachLCNTService.approve(body);
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
    return donVi && donVi.length > 0 ? donVi[0].tenDvi : null
  }

  setTitle() {
    let trangThai = this.formData.get('trangThai').value
    // Vật tư
    if (this.formData.get('loaiVthh').value == "02") {
      switch (trangThai) {
        case '00': {
          this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
          this.titleButtonDuyet = 'Gửi duyệt';
          this.titleStatus = 'Dự thảo';

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
          this.styleStatus = 'da-ban-hanh'
          break
        }
      }
    } else {
      switch (trangThai) {
        case '00': {
          this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet'
          this.titleButtonDuyet = 'Ban hành';
          break;
        }
        case '11': {
          this.titleStatus = 'Ban hành';
          this.styleStatus = 'da-ban-hanh'
          break
        }
      }
    }

  }
  firstInitUpdate: boolean = true;
  async bindingData(data) {
    this.formThongTinDX.patchValue({
      loaiHdong: data.loaiHdong,
      pthucLcnt: data.pthucLcnt,
      hthucLcnt: data.hthucLcnt,
      nguonVon: data.nguonVon,
      tgianBdauTchuc: [data.tgianBdauTchucTu, data.tgianBdauTchucDen],
      tgianDthau: [data.tgianDthauTu, data.tgianDthauDen],
      tgianMthau: [data.tgianMthauTu, data.tgianMthauDen],
      tgianNhang: [data.tgianNhangTu, data.tgianNhangDen],
    });
    if (!this.firstInitUpdate) {
      this.formData.patchValue({
        loaiHdong: data.loaiHdong,
        pthucLcnt: data.pthucLcnt,
        hthucLcnt: data.hthucLcnt,
        nguonVon: data.nguonVon,
        tgianBdauTchuc: data.tgianBdauTchucTu,
        tgianDthau: data.tgianDthauTu,
        tgianMthau: data.tgianMthauTu,
        tgianNhang: data.tgianNhangTu
      })
      this.danhsachDx = data.hhDxKhLcntThopDtlList;
      this.danhsachDx.forEach(async (item, index) => {
        await this.dauThauService.getDetail(item.idDxHdr).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            item.dsGoiThau = res.data.dsGtDtlList;
          }
        })
      })
    }
    this.formData.patchValue({
      tchuanCluong: data?.tchuanCluong
    })
    this.firstInitUpdate = false;
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

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(id);
      let data = res.data;
      this.formData.patchValue({
        id: data.id,
        soQd: data.soQd.split("/")[0],
        ngayQd: data.ngayQd,
        ngayHluc: data.ngayHluc,
        loaiVthh: data.loaiVthh,
        tenVthh: data.tenVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        idThHdr: data.idThHdr,
        loaiHdong: data.loaiHdong,
        pthucLcnt: data.pthucLcnt,
        hthucLcnt: data.hthucLcnt,
        nguonVon: data.nguonVon,
        tgianBdauTchuc: data.tgianBdauTchuc,
        tgianDthau: data.tgianDthau,
        tgianMthau: data.tgianMthau,
        tgianNhang: data.tgianNhang,
        namKhoach: data.namKhoach,
        ghiChu: data.ghiChu,
        trangThai: data.trangThai,
        trichYeu: data.trichYeu
      })
      this.danhsachDx = data.hhQdKhlcntDtlList
      console.log(this.danhsachDx);
      this.listDanhSachTongHop = [
        ...this.listDanhSachTongHop,
        {
          id: data.idThHdr
        }
      ]

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

  selectHangHoa() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    let cloaiVthh = null;
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      cloaiVthh = data.ma;
      this.formData.patchValue({
        maVtu: null,
        tenVtu: null,
        cloaiVthh: data.ma,
        tenCloaiVthh: data.ten,
        loaiVthh: data.parent.ma,
        tenVthh: data.parent.ten
      })
    }
    if (data.loaiHang == "VT") {
      if (data.cap == "3") {
        cloaiVthh = data
        this.formData.patchValue({
          maVtu: data.ma,
          tenVtu: data.ten,
          cloaiVthh: data.parent.ma,
          tenCloaiVthh: data.parent.ten,
          loaiVthh: data.parent.parent.ma,
          tenVthh: data.parent.parent.ten
        })
      }
      if (data.cap == "2") {
        this.formData.patchValue({
          maVtu: null,
          tenVtu: null,
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenVthh: data.parent.ten
        })
      }
    }
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
