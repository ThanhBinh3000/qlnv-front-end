import { saveAs } from 'file-saver';
import { BienBanLayMauDieuChuyenService } from './../../services/dcnb-bien-ban-lay-mau.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import {
  KetQuaKiemNghiemChatLuongHang,
  PhieuKiemNghiemChatLuongHang,
} from 'src/app/models/PhieuKiemNghiemChatLuongThoc';
import { UserLogin } from 'src/app/models/userlogin';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBienBanBanGiaoService } from 'src/app/services/quanLyBienBanBanGiao.service';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemNghiemChatLuongHang.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from 'src/app/components/base/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { STATUS } from 'src/app/constants/status';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { M } from '@angular/cdk/keycodes';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { HelperService } from 'src/app/services/helper.service';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { PhieuKiemNghiemChatLuongDieuChuyenService } from '../../services/dcnb-phieu-kiem-nghiem-chat-luong.service';
import { PassDataPKNCL } from '../quan-ly-phieu-kiem-nghiem-chat-luong.component';
import { KhCnQuyChuanKyThuat } from 'src/app/services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { PREVIEW } from 'src/app/constants/fileType';
@Component({
  selector: 'app-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongXuatDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() isVatTu: boolean;
  @Input() loaiDc: string;
  @Input() thayDoiThuKho: boolean;
  @Input() type: string;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() passData: PassDataPKNCL = {
    soQdinhDcc: '', qdinhDccId: null, ngayQDHieuLuc: '', soBBLayMau: '', ngaylayMau: '', soPhieuKnChatLuong: '', phieuKnChatLuongId: null, bblayMauId: null,
    donViTinh: '', maChLoaiHangHoa: '', maHangHoa: '', maDiemKho: '', maNhaKho: '', maNganKho: '', maLoKho: '',
    tenDiemKho: '', tenNhaKho: '', tenNganKho: '', tenLoKho: '', tenHangHoa: '', tenChLoaiHangHoa: '', thuKhoId: null, tenThuKho: '', keHoachDcDtlId: null, ngayHieuLuc: '', ngayQdinhDc: ''
  };
  @Output()
  showListEvent = new EventEmitter<any>();
  userInfo: UserLogin;
  detail: any = {};
  idNhapHang: number = 0;

  loaiVthh: string[];
  loaiStr: string;
  maVthh: string;
  routerVthh: string;
  dsTong: any = {};
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];
  listSoQuyetDinh = [];
  listBbBanGiaoMau = [];
  dataTableChiTieu: any[] = [];
  id: number;
  listBienBanLayMau: any[] = [];
  dinhKems: any[] = [];
  phuongPhapLayMaus: any[];

  phieuKiemNghiemChatLuongHang: PhieuKiemNghiemChatLuongHang =
    new PhieuKiemNghiemChatLuongHang();
  viewChiTiet: boolean = false;
  ketQuaKiemNghiemHangCreate: KetQuaKiemNghiemChatLuongHang =
    new KetQuaKiemNghiemChatLuongHang();
  dsKetQuaKiemNghiemHangClone: Array<KetQuaKiemNghiemChatLuongHang> = [];
  isChiTiet: boolean = false;
  listTieuChuan: any[] = [];
  isValid = false;
  LIST_TRANG_THAI: { [key: string]: string } = {
    [STATUS.DU_THAO]: "Dự thảo",
    [STATUS.CHO_DUYET_TP]: "Chờ duyệt - TP",
    [STATUS.CHO_DUYET_LDC]: "Chờ duyệt - LĐ Cục",
    [STATUS.TU_CHOI_TP]: "Từ chối - TP",
    [STATUS.TU_CHOI_LDC]: "Từ chối - LĐ Cục",
    [STATUS.DA_DUYET_LDC]: "Đã duyệt - LĐ Cục"
  }
  DANH_GIA: { [key: number]: string } = {
    0: "Không đạt",
    1: "Đạt"
  }
  LIST_DANH_GIA: any[] = [
    { value: 0, label: "Không đạt" },
    { value: 1, label: "Đạt" }
  ]
  maBb: string;
  previewName: string = "";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangService,
    private danhMucService: DanhMucService,
    private quanLyBienBanLayMauService: QuanLyBienBanLayMauService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bienBanLayMauDieuChuyenService: BienBanLayMauDieuChuyenService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private phieuKiemNghiemChatLuongDieuChuyenService: PhieuKiemNghiemChatLuongDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongDieuChuyenService);
    this.formData = this.fb.group({
      id: [null],
      trangThai: [STATUS.DU_THAO, [Validators.required]],
      tenTrangThai: ['Dự Thảo', [Validators.required]],
      lyDoTuChoi: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maDvi: ['', [Validators.required]],
      maQhns: ['', [Validators.required]],
      tenNguoiKiemNghiem: [''],
      tpNguoiKt: [''],

      ketQuaDanhGia: [''],
      ngayLapPhieu: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      donViTinh: ['', [Validators.required]],
      maDiemKho: ['', [Validators.required]],
      maLoKho: [''],
      maNganKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      ngayDuyetTp: [''],
      ngayGDuyet: [''],
      ngayKiem: [dayjs().format('YYYY-MM-DD')],
      ngayQdinhDc: ['', [Validators.required]],
      ngayLayMau: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayPDuyet: [''],
      ngayXuatDocKho: [''],
      nguoiDuyetTp: [null],
      nguoiGDuyet: [null],
      nguoiKt: ['', [Validators.required]],
      nguoiKtId: [null, [Validators.required]],
      nguoiPDuyet: [null],
      qdDcId: [null, [Validators.required]],
      soBbHaoDoi: [''],
      bbLayMauId: ['', [Validators.required]],
      soBbLayMau: ['', [Validators.required]],
      soBbTinhKho: [''],
      soPhieu: [''],
      soQdinhDc: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      tenNganKho: [''],
      tenLoKho: [''],
      tenNganLoKho: ['', [Validators.required]],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: ['', [Validators.required]],
      tenCloaiVthh: ['', [Validators.required]],
      tenThuKho: [''],
      thuKhoId: [null],
      tpNguoiKtId: [null],
      nhanXetKetLuan: ['', [Validators.required]],
      danhGiaCamQuan: ['', [Validators.required]],
      keHoachDcDtlId: [null, [Validators.required]],
      ngayHieuLuc: [, [Validators.required]],
    });
    this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;
    this.previewName = this.isVatTu ? "phieu_kiem_nghiem_chat_luong_vt_dieu_chuyen" : "nhap_xuat_lt_phieu_kiem_nghiem_chat_luong_lt"
  }
  booleanParse = (str: string): boolean => {
    if (str === "true") return true;
    return false;
  }
  async ngOnInit() {
    try {
      this.spinner.show();
      if (this.isViewOnModal) {
        this.isView = this.isViewOnModal
      }
      this.userInfo = this.userService.getUserLogin();
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    finally {
      this.spinner.hide()
    }
  }
  async initForm() {
    if (this.passData.maHangHoa) {
      // let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(this.passData.maChLoaiHangHoa);
      let dmTieuChuan = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(this.passData.maChLoaiHangHoa);
      if (dmTieuChuan.data) {
        this.dataTableChiTieu = Array.isArray(dmTieuChuan.data) ? dmTieuChuan.data.map(element => ({ edit: false, chiSoCl: element.mucYeuCauXuat, chiTieuCl: element.tenChiTieu, danhGia: element.danhGia, hdrId: element.hdrId, id: element.id, ketQuaPt: element.ketQuaPt, phuongPhap: element.phuongPhap })) : [];
      }
    }
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      nguoiKt: this.userInfo.TEN_DAY_DU,
      nguoiKtId: this.userInfo.ID,
      trangThai: STATUS.DU_THAO,
      donViTinh: this.passData.donViTinh,
      loaiVthh: this.passData.maHangHoa,
      cloaiVthh: this.passData.maChLoaiHangHoa,
      maDiemKho: this.passData.maDiemKho,
      maLoKho: this.passData.maLoKho,
      maNganKho: this.passData.maNganKho,
      maNhaKho: this.passData.maNhaKho,
      ngayLayMau: this.passData.ngaylayMau,
      qdDcId: this.passData.qdinhDccId,
      bbLayMauId: this.passData.bblayMauId,
      soBbLayMau: this.passData.soBBLayMau,
      soQdinhDc: this.passData.soQdinhDcc,
      tenCloaiVthh: this.passData.tenChLoaiHangHoa,
      tenDiemKho: this.passData.tenDiemKho,
      tenLoKho: this.passData.tenLoKho,
      tenLoaiVthh: this.passData.tenHangHoa,
      tenNganKho: this.passData.tenNganKho,
      tenNhaKho: this.passData.tenNhaKho,
      tenNganLoKho: this.passData.tenLoKho ? `${this.passData.tenLoKho} - ${this.passData.tenNganKho}` : this.passData.tenNganKho,
      thuKhoId: this.passData.thuKhoId,
      tenThuKho: this.passData.tenThuKho,
      keHoachDcDtlId: this.passData.keHoachDcDtlId,
      ngayHieuLuc: this.passData.ngayHieuLuc,
      ngayQdinhDc: this.passData.ngayQdinhDc
    });
    if (this.passData.maChLoaiHangHoa) {
      this.getChiTietHangHoa(this.passData.maChLoaiHangHoa)
    }
    if (this.passData.qdinhDccId) {
      this.getDetailQuyetDinhCuc(this.passData.qdinhDccId)
    }
  }
  async getDetailQuyetDinhCuc(id: number) {
    let dataRes = await this.quyetDinhDieuChuyenCucService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdinhDc: data.soQdinh,
      qdDcId: data.id,
      ngayQdinhDc: data.ngayKyQdinh,
      ngayHieuLuc: data.ngayHieuLuc
    });
  }
  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      isVatTu: this.isVatTu,
      loaiDc: this.loaiDc,
      thayDoiThuKho: this.thayDoiThuKho,
      maDvi: this.formData.value.id > 0 ? this.formData.value.maDvi : this.userInfo.MA_DVI
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenCuc(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = Array.isArray(data) ? data.reduce((arr, cur) => {
        if (arr.findIndex(f => f.soQdinh == cur.soQdinh) < 0) {
          arr.push(cur)
        }
        return arr
      }, []) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async getDetail(idInput: number) {
    let res = await this.phieuKiemNghiemChatLuongDieuChuyenService.getDetail(idInput);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        const data = res.data;
        this.helperService.bidingDataInFormGroup(this.formData, { ...data, soPhieu: data.soPhieu ? data.soPhieu : data.id ? `${data.id}/${data.nam}/${this.maBb}` : "", tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho });
        // this.bindingDataBbLayMau(data.soBbLayMau.split('/')[0], true);
        this.dataTableChiTieu = data.dcnbPhieuKnChatLuongDtl;
        this.dinhKems = data.dinhKems;
        this.listHinhThucBaoQuan = typeof data.hinhThucBq === "string" || data.hinhThucBq instanceof String ? data.hinhThucBq.split("-*").map(f => ({ id: f.split("+*")[0], giaTri: f.split("+*")[1] })) : [];

        await this.bindingDataBbLayMau(data.bbLayMauId, true)
      }
    }
  }

  isDisableField() {
    if (this.phieuKiemNghiemChatLuongHang &&
      (this.phieuKiemNghiemChatLuongHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN
        || this.phieuKiemNghiemChatLuongHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.phieuKiemNghiemChatLuongHang.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  newObjectBienBanLayMau() {
    this.phieuKiemNghiemChatLuongHang = new PhieuKiemNghiemChatLuongHang();
  }

  async save(isGuiDuyet?: boolean) {
    try {

      await this.spinner.show();
      // this.setValidator(isGuiDuyet);
      if (!Array.isArray(this.dataTableChiTieu) || this.dataTableChiTieu.length <= 0) {
        return this.notification.error(MESSAGE.ERROR, "Không có dữ liệu kết quả phân tích chỉ tiêu chất lượng")
      } else if (!this.dataTableChiTieu.find(f => f.ketQuaPt && [0, 1].includes(f.danhGia))) {
        return this.notification.error(MESSAGE.ERROR, "Không có kết quả phân tích hoặc đánh giá chỉ tiêu chất lượng")
      }
      let body = this.formData.value;
      body.dcnbPhieuKnChatLuongDtl = this.dataTableChiTieu.map(f => ({ ...f, id: f.hdrId ? f.id : undefined }));
      body.dinhKems = this.dinhKems;
      body.hinhThucBq = this.listHinhThucBaoQuan.map(i => `${i.id}+*${i.giaTri}`).join("-*");
      // body.pplayMau = this.phuongPhapLayMaus.map(f => `${f.id}-${f.giaTri}-${f.checked}`).join("-*");
      body.loaiDc = this.loaiDc;
      body.isVatTu = this.isVatTu;
      body.thayDoiThuKho = this.thayDoiThuKho;
      body.type = this.type;
      body.loaiQding = this.loaiDc === "CUC" ? "XUAT" : undefined;
      let data = await this.createUpdate(body, null, isGuiDuyet);
      if (!data) return;
      this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soPhieu: data.soPhieu ? data.soPhieu : data.id ? `${data.id}/${data.nam}/${this.maBb}` : '' })
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      await this.spinner.hide();

    }
  }

  pheDuyet() {
    let trangThai = '';
    let mess = '';
    let MSG = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        mess = 'Bạn có muốn gửi duyệt ?';
        MSG = MESSAGE.GUI_DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn duyệt ?';
        MSG = MESSAGE.DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?';
        MSG = MESSAGE.PHE_DUYET_SUCCESS;
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            trangThai: trangThai
          };
          let res =
            await this.phieuKiemNghiemChatLuongDieuChuyenService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MSG);
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
    let trangThai = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
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
            id: this.formData.value.id,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          let res =
            await this.phieuKiemNghiemChatLuongDieuChuyenService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
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

  async loadBbLayMau() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiDc: this.loaiDc,
      thayDoiThuKho: this.thayDoiThuKho,
      isVatTu: this.isVatTu,
      type: this.type,
      soQdinhDcc: this.formData.value.soQdinhDc,
      paggingReq: {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      maDvi: this.formData.value.id > 0 ? this.formData.value.maDvi : this.userInfo.MA_DVI
      // loaiVthh: this.loaiVthh,
    }
    let res = await this.phieuKiemNghiemChatLuongDieuChuyenService.dsBBLMKiemNghiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listBienBanLayMau = Array.isArray(res.data) ? res.data : []
    }
  };
  async openDialogQuyetDinhDC() {
    if(this.isView){
      return;
    }
    // await this.loadBbLayMau();
    await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QUYẾT ĐỊNH XUẤT ĐIỀU CHUYỂN HÀNG HÓA',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày ký quyết định'],
        dataColumn: ['soQdinh', 'ngayKyQdinh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          tenNganLoKho: '',
          maLoKho: '',
          tenLoKho: '',
          maNganKho: '',
          tenNganKho: '',
          maNhaKho: '',
          tenNhaKho: '',
          maDiemKho: '',
          tenDiemKho: '',
          loaiVthh: '',
          tenLoaiVthh: '',
          cloaiVthh: '',
          tenCloaiVthh: '',
          thuKhoId: null,
          tenThuKho: '',
          donViTinh: '',

          bbLayMauId: '',
          soBbLayMau: '',
          ngayLayMau: '',
          danhGiaCamQuan: '',
          nhanXetKetLuan: '',
          ngayHieuLuc: '',
          ngayQdinhDc: ''

        })
        // this.listHinhThucBaoQuan = [];
        this.phuongPhapLayMaus = [];
        this.dinhKems = [];
        this.dataTableChiTieu = [];
        this.bindingDataQd(data.id, false);
      }
    });
  }
  async bindingDataQd(id, isChiTiet?) {
    try {
      await this.spinner.show();
      await this.getDetailQuyetDinhCuc(id)

      if (!isChiTiet) {
        // const listBienBanLayMau=
      }
    } catch (error) {
      console.log("error", error);

    } finally {
      await this.spinner.hide();

    }
  }
  async openDialogBbLayMau() {
    if(this.isView){
      return;
    }
    if (!this.formData.value.qdDcId) return;
    await this.loadBbLayMau();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBienBanLayMau,
        // dataHeader: ['Số biên bản', 'Số biên bản nhập đầy kho', 'Số QĐ Giao ĐC'],
        // dataColumn: ['soBbLayMau', 'soBbNhapDayKho', 'soQdinhDcc']
        dataHeader: ['Số biên bản', 'Số QĐ ĐC', 'Ngày lấy mẫu', 'Địa điểm lấy mẫu'],
        dataColumn: ['soBbLayMau', 'soQdinhDcc', 'ngayLayMau', 'diaDiemLayMau']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          tenNganLoKho: '',
          maLoKho: '',
          tenLoKho: '',
          maNganKho: '',
          tenNganKho: '',
          maNhaKho: '',
          tenNhaKho: '',
          maDiemKho: '',
          tenDiemKho: '',
          loaiVthh: '',
          tenLoaiVthh: '',
          cloaiVthh: '',
          tenCloaiVthh: '',
          thuKhoId: null,
          tenThuKho: '',
          donViTinh: '',

          bbLayMauId: '',
          soBbLayMau: '',
          ngayLayMau: '',
          danhGiaCamQuan: '',
          nhanXetKetLuan: '',
        });
        // this.listHinhThucBaoQuan = [];
        this.phuongPhapLayMaus = [];
        this.dinhKems = [];
        this.dataTableChiTieu = [];
        this.bindingDataBbLayMau(data.id, false);
      }
    });
  }
  async bindingDataBbLayMau(id, isChiTiet) {
    let res = await this.bienBanLayMauDieuChuyenService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      // this.phuongPhapLayMaus = data.pplayMau && typeof data.pplayMau === "string" && data?.pplayMau?.split("-*") ? data.pplayMau.split("-*").map(f => ({ id: f.split("+*")[0], giaTri: f.split("+*")[1], checked: this.booleanParse(f.split("+*")[2]) })) : []
      if (!isChiTiet) {
        this.formData.patchValue({
          bbLayMauId: data.id,
          soBbLayMau: data.soBbLayMau,
          ngayLayMau: data.ngayLayMau,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          thuKhoId: data.thuKho,
          tenThuKho: data.tenThuKho,
          donViTinh: data.donViTinh,
          keHoachDcDtlId: data.keHoachDcDtlId,
          // ngayHieuLuc: data.ngayHieuLuc,
          // ngayQdinhDc: data.ngayQdinhDc
          // moTaHangHoa: data.moTaHangHoa,
          // tenThuKho: data.bbNhapDayKho.tenNguoiTao
        })
        if (data.cloaiVthh) {
          this.getChiTietHangHoa(data.cloaiVthh)
        }
        const dmTieuChuan = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(data.cloaiVthh);
        if (dmTieuChuan.data) {
          this.dataTableChiTieu = Array.isArray(dmTieuChuan.data) ? dmTieuChuan.data.map(element => ({ edit: false, chiSoCl: element.mucYeuCauXuat, chiTieuCl: element.tenChiTieu, danhGia: element.danhGia, hdrId: element.hdrId, id: element.id, ketQuaPt: element.ketQuaPt, phuongPhap: element.phuongPhapXd })) : [];
        };
      }
      // if (!isChiTiet) {
      // let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
      // let [dmTieuChuan, chiTietHangHoa] = await Promise.all([this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh), this.danhMucService.loadDanhMucHangChiTiet(data.cloaiVthh)])
      // if (dmTieuChuan.data) {
      //   this.dataTableChiTieu = Array.isArray(dmTieuChuan.data.children) ? dmTieuChuan.data.children.map(element => ({ edit: false, chiSoCl: element.chiSoXuat, chiTieuCl: element.tenTchuan, danhGia: element.danhGia, hdrId: element.hdrId, id: element.id, ketQuaPt: element.ketQuaPt, phuongPhap: element.phuongPhap })) : [];
      // };
      // }
    }
  }
  async getChiTietHangHoa(cloaiVthh: string) {
    const res = await this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh);
    if (res.msg === MESSAGE.SUCCESS) {
      this.listHinhThucBaoQuan = Array.isArray(res.data.hinhThucBq) ? res.data.hinhThucBq : [];
    }
  }
  // async loadDanhMucPhuongThucBaoQuan() {
  //   let body = {
  //     maHthuc: null,
  //     paggingReq: {
  //       limit: 1000,
  //       page: 1,
  //     },
  //     str: null,
  //     tenHthuc: null,
  //     trangThai: null,
  //   };
  //   let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     if (res.data && res.data.content) {
  //       this.listHinhThucBaoQuan = res.data.content;
  //     }
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  back() {
    this.showListEvent.emit();
  }

  async loadTieuChuan() {
    let body = {
      maHang: this.maVthh,
      namQchuan: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenQchuan: null,
      trangThai: '01',
    };
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (
          res.data.content[0].children &&
          res.data.content[0].children.length > 0
        ) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  startEdit(index: number) {
    this.dsKetQuaKiemNghiemHangClone[index].isEdit = true;
  }

  deleteData(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.phieuKiemNghiemChatLuongHang.kquaKnghiem =
          this.phieuKiemNghiemChatLuongHang?.kquaKnghiem.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.phieuKiemNghiemChatLuongHang?.kquaKnghiem.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsKetQuaKiemNghiemHangClone = cloneDeep(
          this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
        );
        // this.loadData();
      },
    });
  }

  saveEditPhieuKiemNghiem(i: number): void {
    this.dsKetQuaKiemNghiemHangClone[i].isEdit = false;
    Object.assign(
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem[i],
      this.dsKetQuaKiemNghiemHangClone[i],
    );
  }

  cancelEditPhieuKiemNghiem(index: number) {
    this.dsKetQuaKiemNghiemHangClone = cloneDeep(
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
    );
    this.dsKetQuaKiemNghiemHangClone[index].isEdit = false;
  }

  getNameFile(event?: any) {
    // const element = event.currentTarget as HTMLInputElement;
    // const fileList: FileList | [null] = element.files;
    // if (fileList) {
    //   this.nameFile = fileList[0].name;
    // }
    // this.formData.patchValue({
    //   file: event.target.files[0] as File,
    // });
    // if (this.dataCanCuXacDinh) {
    //   this.formTaiLieuClone.file = this.nameFile;
    //   this.isSave = !isEqual(this.formTaiLieuClone, this.formTaiLieu);
    // }
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }
  // setValidator(isGuiDuyet) {
  //   if (isGuiDuyet) {
  //     // this.formData.controls['soPhieu'].setValidators([Validators.required]);
  //     this.formData.controls['danhGiaCamQuan'].setValidators([Validators.required]);
  //     this.formData.controls['nhanXetKetLuan'].setValidators([Validators.required]);

  //   } else {
  //     // this.formData.controls['soPhieu'].clearValidators();
  //     this.formData.controls['danhGiaCamQuan'].clearValidators();
  //     this.formData.controls['nhanXetKetLuan'].clearValidators();
  //   }
  // }
}
