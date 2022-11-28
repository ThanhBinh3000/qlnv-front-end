import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanGuiHang, ChiTiet } from 'src/app/models/BienBanGuiHang';
import { QuyetDinhNhapXuat } from 'src/app/models/QuyetDinhNhapXuat';
import { UserLogin } from 'src/app/models/userlogin';
import { BienBanGuiHangService } from 'src/app/services/bienBanGuiHang.service';
import { PhieuNhapKhoTamGuiService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/phieuNhapKhoTamGui.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { PhieuNhapKhoTamGui } from './../../../../../../models/PhieuNhapKhoTamGui';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  DialogQuyetDinhGiaoChiTieuComponent
} from "../../../../../../components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component";
import { BaseComponent } from 'src/app/components/base/base.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
@Component({
  selector: 'app-thong-tin-bien-ban-gui-hang',
  templateUrl: './thong-tin-bien-ban-gui-hang.component.html',
  styleUrls: ['./thong-tin-bien-ban-gui-hang.component.scss']
})
export class ThongTinBienBanGuiHangComponent extends BaseComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  userInfo: UserLogin;
  listSoQuyetDinh: any[] = [];

  bienBanGuiHang: BienBanGuiHang = new BienBanGuiHang();
  phieuNhapKhoTamGuis: Array<PhieuNhapKhoTamGui> = [];
  chiTietBienBanGuiHangBenGiao: ChiTiet = new ChiTiet();
  chiTietBienBanGuiHangBenNhan: ChiTiet = new ChiTiet();
  quyetDinhNhapHang: QuyetDinhNhapXuat = new QuyetDinhNhapXuat();
  hopDong: any = {};
  listHopDong: any[] = [];
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  formData: FormGroup;
  listFileDinhKem: any[] = [];
  listDiaDiemNhap: any[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private phieuNhapKhoTamGuiService: PhieuNhapKhoTamGuiService,
    public globals: Globals,
    private thongTinHopDongService: ThongTinHopDongService,
    private bienBanGuiHangService: BienBanGuiHangService,
    private fb: FormBuilder,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService
  ) {
    super();
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      namKeHoach: [''],
      maDvi: ['', [Validators.required]],
      maQhns: ['',],
      tenDvi: ['', [Validators.required]],

      soBienBanGuiHang: [],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],


      soQdGiaoNvNh: [],
      idQdGiaoNvNh: [],

      soHd: [''],
      ngayHd: [null,],

      idDdiemGiaoNvNh: [, [Validators.required]],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      soLuongDdiemGiaoNvNh: [''],
      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tenNguoiTao: [''],
      tenNguoiPduyet: [''],
      keToanTruong: [''],
      nguoiGiaoHang: [''],
      cmtNguoiGiaoHang: [''],
      donViGiaoHang: [''],
      diaChiNguoiGiao: [''],
      thoiGianGiaoNhan: [''],
      ghiChu: [''],
      soBangKeCanHang: [''],
      trangThai: [],
      tenTrangThai: [],
      lyDoTuChoi: [],
      donGiaHd: []
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {

      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.loadPhieuNhapKhoTamGui(),
        // this.loadSoQuyetDinh(),
      ]);
      // await this.loadChiTiet(this.id);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  isDisableField() {
    if (this.bienBanGuiHang && (this.bienBanGuiHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanGuiHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanGuiHang.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.bienBanGuiHangService.chiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.bienBanGuiHang = res.data;
        }
      }
    }
  }


  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
          };
          let res =
            await this.bienBanGuiHangService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  pheDuyet() {
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
    if (this.bienBanGuiHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
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
            await this.bienBanGuiHangService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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
            trangThai: this.bienBanGuiHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP ? this.globals.prop.NHAP_TU_CHOI_TP : this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res =
            await this.bienBanGuiHangService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = this.formData.value
      if (this.id > 0) {
        let res = await this.bienBanGuiHangService.chinhSua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.bienBanGuiHangService.themMoi(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  addDaiDien(bienBan: ChiTiet, type: string) {
    if ((type == '00' && (!this.chiTietBienBanGuiHangBenNhan.daiDien || !this.chiTietBienBanGuiHangBenNhan.chucVu))
      || (type == '01' && (!this.chiTietBienBanGuiHangBenGiao.daiDien || !this.chiTietBienBanGuiHangBenGiao.chucVu))) {
      return;
    }

    const chiTiet = new ChiTiet();
    chiTiet.idVirtual = new Date().getTime();
    chiTiet.loaiBen = type;
    chiTiet.chucVu = bienBan.chucVu;
    chiTiet.daiDien = bienBan.daiDien;
    this.bienBanGuiHang.chiTiets.push(chiTiet);
    this.clearDaiDien(type);
  }

  clearDaiDien(type: string) {
    if (type === '00') {
      this.chiTietBienBanGuiHangBenNhan = new ChiTiet();
    } else {
      this.chiTietBienBanGuiHangBenGiao = new ChiTiet();
    }
  }
  deleteBienBan(id: number) {
    this.bienBanGuiHang.chiTiets = this.bienBanGuiHang.chiTiets.filter(bienBan => bienBan.id !== id);
  }

  async openDialogSoQd() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": this.STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      ngayHd: data.hopDong.ngayKy,
      donGiaHd: data.hopDong.donGia
    });
    let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children;
    }

    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'SL theo QĐ giao NV NH'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.formData.patchValue({
        idDdiemGiaoNvNh: data.id,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        soLuongDdiemGiaoNvNh: data.soLuong,
      });
    }
  }

}
