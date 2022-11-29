import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HoSoKyThuatService } from 'src/app/services/hoSoKyThuat.service';
import { QuanLyBienBanBanGiaoService } from 'src/app/services/quanLyBienBanBanGiao.service';
import { QuanLyNghiemThuKeLotService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from "../../../../../../components/base/base.component";
import { FormBuilder, Validators } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from '../../../../../../constants/config';
import { HelperService } from '../../../../../../services/helper.service';
import { DatePipe } from '@angular/common';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-them-moi-ho-so-ky-thuat',
  templateUrl: './them-moi-ho-so-ky-thuat.component.html',
  styleUrls: ['./them-moi-ho-so-ky-thuat.component.scss']
})
export class ThemMoiHoSoKyThuatComponent extends BaseComponent implements OnInit {

  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;
  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  listThuKho: any[] = [];
  listNganLo: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listBanGiaoMau: any[] = [];

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  capCuc: string = '2';
  capChiCuc: string = '3';
  capDonVi: string = '0';
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  listDaiDienDonVi: any[] = [];
  fileDinhKem: any[] = [];
  listCanCu: any[] = [];
  listFileDinhKem: any[] = [];
  listHopDong: any[] = [];
  title: "";
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  datePipe = new DatePipe('en-US');
  STATUS = STATUS;
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private modal: NzModalService,
    public userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private hoSoKyThuatService: HoSoKyThuatService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quanLyBienBanBanGiaoService: QuanLyBienBanBanGiaoService,
    public globals: Globals,
    private fb: FormBuilder,
    private helperService: HelperService,
  ) {
    super();
    this.formData = this.fb.group({
      id: [],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      diaChiDvi: [],
      namKhoach: [dayjs().get('year'), [Validators.required]],
      trichYeu: [null],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      soHoSo: [null, [Validators.required]],
      soBienBan: [null, [Validators.required]],
      soQdNv: [null, [Validators.required]],
      soHd: [null, [Validators.required]],
      ghiChu: [null],
      ldoTuchoi: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự Thảo'],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.typeVthh = '02';
      this.create.dvt = "Tấn";
      this.detail.trangThai = "00";
      this.userInfo = this.userService.getUserLogin();
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.detail.tenTrangThai = 'Dự thảo';
      await Promise.all([
        this.loadBanGiaoMau(),
        this.loadSoQuyetDinh(),
      ]);
      await this.loadChiTiet(this.id);
      this.detail.loaiVthh = this.typeVthh;
      this.detail.tenVthh = "Vật tư";
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  selectHangHoa() {
    if (this.isDisableField() || this.isView) {
      return;
    }
    let data = this.detail.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: { data },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      this.detail.maVatTuCha = data.parent.ma;
      this.detail.tenVatTuCha = data.parent.ten;
      this.detail.maVatTu = data.ma;
      this.detail.tenVatTu = data.ten;
    }
    if (data.loaiHang == "VT") {
      if (data.cap == "3") {
        this.detail.maVatTuCha = data.parent.parent.ma;
        this.detail.tenVatTuCha = data.parent.parent.ten;
        this.detail.maVatTu = data.parent.ma;
        this.detail.tenVatTu = data.parent.ten;
      }
      if (data.cap == "2") {
        this.detail.maVatTuCha = data.parent.ma;
        this.detail.tenVatTuCha = data.parent.ten;
        this.detail.maVatTu = data.ma;
        this.detail.tenVatTu = data.ten;
      }
    }
  }


  async loadBanGiaoMau() {
    let body = {
      "capDvis": '3',
      "maDvi": this.detail.maDvi,
      "maVatTuCha": this.typeVthh,
      "paggingReq": {
        "limit": 1000,
        "page": 0
      },
      "trangThai": this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
    }
    let res = await this.quanLyBienBanBanGiaoService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBanGiaoMau = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeBanGiaoMau() {
    let banGiao = this.listBanGiaoMau.filter(x => x.id == this.detail.bienBanGiaoMauId);
    if (banGiao && banGiao.length > 0) {
      // this.detailGiaoNhap = banGiao[0];
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.detail.maDvi,
      "maVthh": this.typeVthh,
      "paggingReq": {
        "limit": 1000,
        "page": 0
      },
      "trangThai": this.globals.prop.NHAP_BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeSoQuyetDinh(autoChange: boolean) {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.detail.qdgnvnxId);
    if (quyetDinh && quyetDinh.length > 0) {
      this.detailGiaoNhap = quyetDinh[0];
      this.listHopDong = [];
      this.detailGiaoNhap.children1.forEach(element => {
        if (element && element.hopDong) {
          if (element.hopDong.loaiVthh.startsWith('02')) {
            this.listHopDong.push(element);
          }
        }
      });
      if (!autoChange) {
        this.detail.soHopDong = null;
        this.detail.hopDongId = null;
        this.detail.ngayHopDong = null;
        this.detail.maHangHoa = null;
        this.detail.khoiLuongKiemTra = null;
        this.detail.maHangHoa = null;
        this.detail.tenVatTuCha = null;
        this.detail.tenVatTu = null;
        this.detail.maVatTuCha = null;
        this.detail.maVatTu = null;
      } else {
        await this.changeHopDong();
      }
    }
  }

  async changeHopDong() {
    if (this.detail.soHopDong) {
      let body = {
        "str": this.detail.soHopDong
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.detail.hopDongId = this.detailHopDong.id;
        this.detail.soHopDong = this.detailHopDong.soHd;
        this.detail.ngayHopDong = this.detailHopDong.ngayKy;
        this.detail.tenVatTuCha = this.detailHopDong.tenVthh;
        this.detail.tenVatTu = this.detailHopDong.tenCloaiVthh;
        this.detail.maVatTuCha = this.detailHopDong.loaiVthh;
        this.detail.maVatTu = this.detailHopDong.cloaiVthh;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.hoSoKyThuatService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          if (this.detail.children) {
            this.detail.detail = this.detail.children;
          }
          if (this.detail.bienBanGiaoMauId) {
            this.detail.bienBanGiaoMauId = +this.detail.bienBanGiaoMauId;
          }
          if (this.detail.fdkCanCus) {
            this.listCanCu = this.detail.fdkCanCus;
          }
          if (this.detail.fileDinhKems) {
            this.listFileDinhKem = this.detail.fileDinhKems;
          }
          await this.changeSoQuyetDinh(true);
        }
      }
    }
    else {
      let id = await this.userService.getId("HO_SO_KY_THUAT_SEQ")
      this.formData.patchValue({
        id: id+"/"+dayjs().get('year')+"/HSKT-CDTKVVP",
        tenDvi: this.userInfo.TEN_DVI,
        maDvi: this.userInfo.MA_DVI,
        diaChiDvi: this.userInfo.DON_VI.diaChi,
      })
    }
  }



  pheDuyet() {
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
    if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
      trangThai = this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };
          let res =
            await this.hoSoKyThuatService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
            lyDoTuChoi: text,
            trangThai: this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP ? this.globals.prop.NHAP_TU_CHOI_TP : this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res =
            await this.hoSoKyThuatService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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



  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  async save(isGuiDuyet?) {

    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    let body = this.formData.value;
    body.ngayTao = this.datePipe.transform(body.ngayTao, 'yyyy-MM-dd');
    body.fileDinhkems = this.fileDinhKem;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.hoSoKyThuatService.update(body);
    } else {
      res = await this.hoSoKyThuatService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.id = res.data.id;
        await this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.quayLai();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.quayLai();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_LDC:
            case STATUS.TU_CHOI_TP:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.DA_DUYET_LDC;
              break;
            }
          }
          let res = await this.hoSoKyThuatService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.THAO_TAC_SUCCESS,
            );
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
}
