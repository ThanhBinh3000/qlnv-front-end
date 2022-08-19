import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogTTPhuLucQDDCBanDauGiaComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-qddc-ban-dau-gia/dialog-thong-tin-phu-luc-qddc-ban-dau-gia.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { QuyetDinhPheDuyetKeHoachBanDauGia } from 'src/app/models/QdPheDuyetKHBanDauGia';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DeXuatKeHoachBanDauGiaService } from 'src/app/services/deXuatKeHoachBanDauGia.service';
import { DxuatKhLcntVatTuService } from 'src/app/services/dxuatKhLcntVatTuService.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopDeXuatKHBanDauGiaService } from 'src/app/services/tongHopDeXuatKHBanDauGia.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from '../../../../../../../components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';

@Component({
  selector: 'app-them-moi-qd-phe-duyet-kh-ban-dau-gia',
  templateUrl: './them-moi-qd-phe-duyet-kh-ban-dau-gia.component.html',
  styleUrls: ['./them-moi-qd-phe-duyet-kh-ban-dau-gia.component.scss'],
})
export class ThemMoiQdPheDuyetKhBanDauGiaComponent implements OnInit {
  @Input() loaiVthh: string;
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
  idTongHop: number;
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: '' };
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
  listToTrinh: any[] = [];
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;

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

  isVatTu: boolean = false;

  maTongHopList: any = [];
  thongTinPhuLucs: any = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  qdPheDuyetKhBanDauGia: QuyetDinhPheDuyetKeHoachBanDauGia = new QuyetDinhPheDuyetKeHoachBanDauGia();
  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private dxuatKhLcntVatTuService: DxuatKhLcntVatTuService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    public userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private dauThauService: DanhSachDauThauService,
    private uploadFileService: UploadFileService,
    public globals: Globals,
    private tongHopDeXuatKHBanDauGiaService: TongHopDeXuatKHBanDauGiaService,
  ) { }

  deleteSelect() { }

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
        // this.loadChiTiet(this.idInput);
      } else {
        this.firstInitUpdate = false;
      }
      this.initForm();
      await Promise.all([
        this.loaiHangDTQGGetAll(),
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        this.bindingDataTongHop(this.dataTongHop),
        this.loadMaTongHop(),
        this.loaiVTHHGetAll()
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  initForm() {
    this.formData = this.fb.group({
      namKeHoach: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.namKeHoach
            : null,
          // disabled: this.isView ? true : false
        },
        [],
      ],
      soQuyetDinh: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.soQuyetDinh
            : null,
          disabled: false
        },
        [],
      ],
      ngayKy: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.ngayKy
            : null,
          // disabled: this.isView ? true : false
        },
        [],
      ],
      ngayHieuLuc: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.ngayHieuLuc
            : null,
          // disabled: this.isView ? true : false
        },
        [],
      ],
      tongHopDeXuatKhbdgId: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.tongHopDeXuatKhbdgId
            : null,
          // disabled: this.isView ? true : false
        },
        [],
      ],
      maVatTuCha: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.maVatTuCha
            : null,
          // disabled: this.isView ? true : false
        },
        [],
      ],
      maVatTu: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.maVatTu
            : null,
          // disabled: this.isView ? true : false
        },
        [],
      ],
      loaiVthh: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.loaiVthh
            : null,
          disabled: false
        },
        [],
      ],
      thoiHanTcBdg: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.thoiHanTcBdg
            : null,
          // disabled: this.isView ? true : false
        },
        [],
      ],
      trichYeu: [
        {
          value: this.qdPheDuyetKhBanDauGia
            ? this.qdPheDuyetKhBanDauGia.trichYeu
            : null,
          disabled: false
        },
        [],
      ],
    });
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
        tchuanCluong: dataTongHop.tchuanCluong,
      });
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  collapse2(
    array: DanhSachGoiThau[],
    data: DanhSachGoiThau,
    $event: boolean,
  ): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.idVirtual === d.idVirtual)!;
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
          size: data[i].fileSize
            ? parseFloat(data[i].fileSize.replace('KB', '')) * 1024
            : 0,
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
        fileList = fileList.map((file) => {
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
    this.fileList = this.fileList.filter((x) => x.uid != data.uid);
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
    this.danhsachDx = [];
    let body = {
      trangThai: '00',
      loaiVthh: this.formData.get('loaiVthh').value,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      namKhoach: this.formData.get('namKhoach').value,
    };
    let res;
    if (body.loaiVthh.startsWith('02')) {
      let bodySearchVt = {
        loaiVthh: body.loaiVthh,
        trangThai: '02',
      };
      res = await this.dauThauService.search(bodySearchVt);
    } else {
      res = await this.tongHopDeXuatKHLCNTService.getAll(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (body.loaiVthh.startsWith('02')) {
        res.data.content.forEach((item) => {
          if (!this.maTongHopExis(this.listToTrinh, item.id)) {
            this.listToTrinh.push({
              id: item.id,
              tenTr: item.soDxuat,
            });
          }
        });
      } else {
        res.data.forEach((item) => {
          if (!this.maTongHopExis(this.listDanhSachTongHop, item.id)) {
            this.listDanhSachTongHop.push({ id: item.id });
          }
        });
      }
    }
  }

  maTongHopExis(listDxTh, id) {
    return listDxTh.some(function (el) {
      return el.id === id;
    });
  }

  async openDialogDeXuat(data) {
    this.modal.create({
      nzTitle: 'CHỈNH SỬA THÔNG TIN PHỤ LỤC QUYẾT ĐỊNH PHÊ DUYỆT KH BÁN ĐẤU GIÁ',
      nzContent: DialogTTPhuLucQDDCBanDauGiaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '90%',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        donViTinh: this.qdPheDuyetKhBanDauGia.donViTinh,
      },
    });
  }

  deleteItem(index) {
    this.danhsachDx = this.danhsachDx.filter((item, i) => i !== index);
  }

  firstInitUpdate: boolean = true;
  async selectMaTongHop(event) {
    const res = await this.tongHopDeXuatKHLCNTService.getDetail(event);
    // this.bindingData(res.data);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
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
          tgianNhang: data.tgianNhangTu,
        });
        this.danhsachDx = data.hhDxKhLcntThopDtlList;
        this.danhsachDx.forEach(async (item, index) => {
          await this.dauThauService.getDetail(item.idDxHdr).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.dsGoiThau = res.data.dsGtDtlList;
            }
          });
        });
      }
      this.formData.patchValue({
        tchuanCluong: data?.tchuanCluong,
      });
      this.firstInitUpdate = false;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangeIdTrHdr(data) {
    this.spinner.show();
    this.danhsachDx = [];
    const res = await this.dxuatKhLcntVatTuService.getDetail(data);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      console.log(data);
      this.danhsachDx = data.dsGtDtlList;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async save() {
    if (this.formData.invalid) {
      this.helperService.markFormGroupTouched(this.formData);
      console.log(this.formData.value);
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + '/' + this.maQd;
    body.dsDeXuat = this.danhsachDx;
    body.dsGoiThau = this.danhsachDx;
    body.fileDinhKems = this.fileDinhKem;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.deXuatKeHoachBanDauGiaService.sua(body);
    } else {
      res = await this.deXuatKeHoachBanDauGiaService.them(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.quayLai();
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.quayLai();
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
          const res = await this.deXuatKeHoachBanDauGiaService.updateStatus(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
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
    let trangThai = '';
    let mesg = '';
    if (this.formData.get('loaiVthh').value == '02') {
      switch (this.formData.get('trangThai').value) {
        case '00':
        case '03': {
          trangThai = '01';
          mesg = 'Bạn có muốn gửi duyệt ?';
          break;
        }
        case '01': {
          trangThai = '11';
          mesg = 'Văn bản sẵn sàng ban hành ?';
          break;
        }
      }
    } else {
      switch (this.formData.get('trangThai').value) {
        case '00': {
          trangThai = '11';
          mesg = 'Văn bản sẵn sàng ban hành ?';
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
            id: this.idInput,
            trangThai: trangThai,
          };
          let res = await this.deXuatKeHoachBanDauGiaService.updateStatus(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            this.loadChiTiet(res.data.id);
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.TRINH_DUYET_SUCCESS,
            );
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
    let donVi = this.danhMucDonVi?.filter((item) => item.maDvi == maDvi);
    return donVi && donVi.length > 0 ? donVi[0].tenDvi : null;
  }

  setTitle() {
    let trangThai = this.formData.get('trangThai').value;
    // Vật tư
    if (this.formData.get('loaiVthh').value == '02') {
      switch (trangThai) {
        case '00': {
          this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
          this.titleButtonDuyet = 'Gửi duyệt';
          this.titleStatus = 'Dự thảo';

          break;
        }
        case '03': {
          this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
          this.titleButtonDuyet = 'Gửi duyệt';
          break;
        }
        case '01': {
          this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
          this.titleButtonDuyet = 'Duyệt';
          this.titleStatus = 'Lãnh đạo duyệt';
          break;
        }
        case '11': {
          this.titleStatus = 'Ban hành';
          this.styleStatus = 'da-ban-hanh';
          break;
        }
      }
    } else {
      switch (trangThai) {
        case '00': {
          this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
          this.titleButtonDuyet = 'Ban hành';
          break;
        }
        case '11': {
          this.titleStatus = 'Ban hành';
          this.styleStatus = 'da-ban-hanh';
          break;
        }
      }
    }
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
      let res = await this.deXuatKeHoachBanDauGiaService.loadChiTiet(id);
      if (res.data && res.data.content && res.data.content.length > 0) {
        let data = res.data.content[0];
        this.formData.patchValue({
          id: data.id,
          soQd: data.soQuyetDinhPheDuyet ? data.soQuyetDinhPheDuyet.split('/')[0] : '',
          ngayKy: data.ngayKy,
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
          trichYeu: data.trichYeu,
          thoiHanToChuc: [data.thoiHanToChucTu, data.thoiHanToChucDen],
        });
        this.danhsachDx = data.hhQdKhlcntDtlList;
        this.listDanhSachTongHop = [
          ...this.listDanhSachTongHop,
          {
            id: data.idThHdr,
          },
        ];
      }
    }
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
    this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index);
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
      nzComponentParams: {
        isCaseSpecial: true,
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == 'M' || data.loaiHang == 'LT') {
      this.formData.patchValue({
        maVtu: null,
        tenVtu: null,
        cloaiVthh: data.ma,
        tenCloaiVthh: data.ten,
        loaiVthh: data.parent.ma,
        tenVthh: data.parent.ten,
      });
      this.isVatTu = false;
    }
    if (data.loaiHang == 'VT') {
      this.isVatTu = true;
      this.formData.patchValue({
        loaiVthh: data.ma,
        tenVthh: data.ten,
      });
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

  openDialogGoiThau(data?: any, index?) {
    const modal = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        loaiVthh: data.loaiVthh,
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        console.log(res);
        if (index >= 0) {
          this.danhsachDx[index] = res;
        } else {
          this.danhsachDx.push(res);
        }
        // this.bindingDataNguonVon()
        // this.calendarDinhMuc();
      }
    });
  }
  async loadMaTongHop() {
    this.spinner.show();
    let body = {
      ngayTongHopTuNgay: null,
      ngayTongHopDenNgay: null,
      maVatTuCha: null,
      namKeHoach: null,
      noiDungTongHop: null,
      pageSize: 1000,
      pageNumber: 1,
    };
    let res = await this.tongHopDeXuatKHBanDauGiaService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      console.log(res.data.content);
      this.maTongHopList = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }
  async getMaTongHop(id: number) {
    if (!id) {
      return;
    }
    this.spinner.show();
    await this.tongHopDeXuatKHBanDauGiaService
      .chiTiet(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.tongHopDeXuatTuCuc(res.data.maVatTuCha, res.data.namKeHoach);
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    this.spinner.hide();
  }


  async tongHopDeXuatTuCuc(loaiVthh: string, namKeHoach: number) {
    this.spinner.show();
    let body = {
      loaiVatTuHangHoa: loaiVthh,
      namKeHoach: namKeHoach,
      pageNumber: 1,
      pageSize: 1000,
    };
    let res = await this.deXuatKeHoachBanDauGiaService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.thongTinPhuLucs = res.data.content;
    } else {
      this.listOfData = [];
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }


  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.listLoaiHangHoa = [
                ...this.listLoaiHangHoa,
                item
              ];
            }
            else {
              this.listLoaiHangHoa = [
                ...this.listLoaiHangHoa,
                ...item.child
              ];
            }
          })
          console.log(this.listLoaiHangHoa);

        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  changeHangHoa(id: any) {
    if (!id) {
      return;
    }
    let loaiHangHoa = this.listLoaiHangHoa.filter(x => x.id == id);
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      // if (!this.idInput) {
      //   this.formData.patchValue({ idChungLoaiHangHoa: null })
      // }
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
      this.qdPheDuyetKhBanDauGia.donViTinh = loaiHangHoa[0].maDviTinh;
      console.log("loaiHangHoa[0]: ", loaiHangHoa[0]);
    }
    // console.log("this.listChungLoaiHangHoa: ", this.listChungLoaiHangHoa);
  }

  changeChungLoaiHangHoa(data) {
    // const loaihanghoaDVT = this.listChungLoaiHangHoa.filter(chungloaihanghoa => chungloaihanghoa.ma === this.formData.value.idChungLoaiHangHoa);
    // this.formData.patchValue({ donViTinh: loaihanghoaDVT[0]?.maDviTinh })
  }
}
