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
@Component({
  selector: 'app-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongXuatDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() typeVthh: string[];
  @Input() loaiDc: string;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() passData: PassDataPKNCL;
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
  bienBanLayMauDinhKem: any[] = [];


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
    private phieuKiemNghiemChatLuongDieuChuyenService: PhieuKiemNghiemChatLuongDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongDieuChuyenService);
    this.formData = this.fb.group({
      id: [null],
      type: ['00'],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maDvi: ['', [Validators.required]],
      maQhns: [''],
      tenNguoiKiemNghiem: [''],
      tpNguoiKt: [''],

      ketQuaDanhGia: [''],
      ketLuan: [''],

      ngayTao: [dayjs().format('YYYY-MM-DD')],
      hthucBquan: [''],

      // donViTinh: [['']],
      // soPhieuKnChatLuong: [''], 
      // phieuKnChatLuongId: [null], 
      // soQdinhDcc: [''], 
      // qdinhDccId: [null], 
      // ngayQDHieuLuc: [''], 
      // soBBLayMau: [''], 
      // bblayMauId: [null], 
      // ngaylayMau: [''], 
      // tenloKho: [''], 
      // maloKho: [''],
      // tenNganKho: [''], 
      // maNganKho: [''], 
      // tenNhaKho: [''], 
      // maNhaKho: [''], 
      // tenDiemKho: [''], 
      // maDiemKho: [''], 
      // tenHangHoa: [''], 
      // maHangHoa: [''], 
      // tenChLoaiHangHoa: [''], 
      // maChLoaiHangHoa: [''], 
      // thuKho: [''],
      donViTinh: [''],
      tenDonViTinh: [''],
      hinhThucBq: [''],
      loaiVthh: [''],
      maDiemKho: [''],
      maLoKho: [''],
      maNganKho: [''],
      maNhaKho: [''],
      ngayDuyetTp: [''],
      ngayGDuyet: [''],
      ngayKiem: [dayjs().format('YYYY-MM-DD')],
      ngayHieuLuc: [''],
      ngayLayMau: [''],
      ngayPDuyet: [''],
      ngayXuatDocKho: [''],
      nguoiDuyetTp: [null],
      nguoiGDuyet: [null],
      nguoiKt: [''],
      nguoiKtId: [null],
      nguoiPDuyet: [null],
      nhanXetKetLuan: [''],
      qdDcId: [null],
      soBbHaoDoi: [''],
      bbLayMauId: [''],
      soBbLayMau: [''],
      soBbTinhKho: [''],
      soPhieu: [''],
      soQdinhDc: [''],
      tenCloaiVthh: [''],
      tenDiemKho: [''],
      tenLoKho: [''],
      tenLoaiVthh: [''],
      tenNganKho: [''],
      tenNhaKho: [''],
      tenThuKho: [''],
      thayDoiThuKho: [null],
      thuKhoId: [null],
      tpNguoiKtId: [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit()
    try {
      this.id = this.idInput;
      this.loaiVthh = this.typeVthh
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadSoQuyetDinh(),
        this.loadDanhMucPhuongThucBaoQuan(),
        this.loadTieuChuan(),
      ]);
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async initForm() {
    let res = await this.userService.getId("DCNB_PHIEU_KN_CHLUONG_HDR_SEQ");
    if (this.passData.maHangHoa) {
      let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(this.passData.maChLoaiHangHoa);
      if (dmTieuChuan.data) {
        this.dataTableChiTieu = dmTieuChuan.data.children;
        this.dataTableChiTieu.forEach(element => {
          element.edit = false
        });
      }
    }
    this.formData.patchValue({
      id: res,
      soPhieu: `${res}/${this.formData.get('nam').value}/PKNCL-CDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      nguoiKt: this.userInfo.TEN_DAY_DU,
      tpNguoiKt: this.userInfo.MA_KTBQ,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: this.LIST_TRANG_THAI[STATUS.DU_THAO],
      donViTinh: this.passData.donViTinh,
      tenDonViTinh: this.passData.tenDonViTinh,
      loaiVthh: this.passData.maHangHoa,
      cloaiVthh: this.passData.maChLoaiHangHoa,
      maDiemKho: this.passData.maDiemKho,
      maLoKho: this.passData.maloKho,
      maNganKho: this.passData.maNganKho,
      maNhaKho: this.passData.maNhaKho,
      ngayLayMau: this.passData.ngaylayMau,
      qdDcId: this.passData.qdinhDccId,
      bbLayMauId: this.passData.bblayMauId,
      soBbLayMau: this.passData.soBBLayMau,
      soQdinhDc: this.passData.soQdinhDcc,
      tenCloaiVthh: this.passData.tenChLoaiHangHoa,
      tenDiemKho: this.passData.tenDiemKho,
      tenLoKho: this.passData.tenloKho,
      tenLoaiVthh: this.passData.tenHangHoa,
      tenNganKho: this.passData.tenNganKho,
      tenNhaKho: this.passData.tenNhaKho,
      tenThuKho: this.passData.thuKho,
      thayDoiThuKho: true,
      // thuKhoId: null,
    });
  }
  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.typeVthh,
      loaiDc: this.loaiDc,
      maDvi: this.userInfo.MA_DVI
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
  async getDetail(id: number) {
    this.spinner.show()
    let res = await this.phieuKiemNghiemChatLuongDieuChuyenService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        const data = res.data;
        this.helperService.bidingDataInFormGroup(this.formData, { ...data, tenTrangThai: this.LIST_TRANG_THAI[data.trangThai] });
        // this.bindingDataBbLayMau(data.soBbLayMau.split('/')[0], true);
        this.dataTableChiTieu = data.dcnbPhieuKnChatLuongDtl;
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
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      let body = this.formData.value;
      body.dcnbPhieuKnChatLuongDtl = this.dataTableChiTieu;
      body.bienBanLayMauDinhKem = this.bienBanLayMauDinhKem;
      let res;
      if (this.idInput > 0) {
        res = await this.phieuKiemNghiemChatLuongDieuChuyenService.update(body);
      } else {
        res = await this.phieuKiemNghiemChatLuongDieuChuyenService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isGuiDuyet) {
          this.id = res.data.id;
          this.pheDuyet();
        } else {
          if (this.idInput) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            // this.back();
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            // this.back();
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
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
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        mess = 'Bạn có muối gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
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
            id: this.id,
            trangThai: trangThai
          };
          let res =
            await this.phieuKiemNghiemChatLuongDieuChuyenService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
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
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          let res =
            await this.phieuKiemNghiemChatLuongDieuChuyenService.approve(
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

  async loadBbLayMau() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiDc: this.loaiDc,
      qdinhDccId: this.formData.value.qdDcId,
      paggingReq: {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      // loaiVthh: this.loaiVthh,
    }
    let res = await this.phieuKiemNghiemChatLuongDieuChuyenService.dsBBLMKiemNghiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listBienBanLayMau = Array.isArray(res.data) ? res.data : []
    }
  };
  async openDialogQuyetDinhDC() {
    // await this.loadBbLayMau();
    // await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách quyết định điều chuyển',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày hiệu lực'],
        dataColumn: ['soQdinh', 'ngayPduyet'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataQd(data.id, false)
    })
  }
  async bindingDataQd(id, isChiTiet?) {
    try {
      await this.spinner.show();
      let dataRes = await this.quyetDinhDieuChuyenCucService.getDetail(id)
      const data = dataRes.data;
      this.formData.patchValue({
        soQdinhDc: data.soQdinh,
        qdDcId: data.id,
        ngayHieuLuc: data.ngayPduyet,
        // loaiVthh: data.loaiVthh,
        // tenLoaiVthh: data.tenLoaiVthh,

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
        tenCloaiVthh: ''
      });
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
        dataHeader: ['Số biên bản', 'Số QĐ Giao ĐC'],
        dataColumn: ['soBbLayMau', 'soQdinhDcc']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataBbLayMau(data.id, false);
    });
  }
  async bindingDataBbLayMau(id, isChiTiet) {
    let res = await this.bienBanLayMauDieuChuyenService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.formData.patchValue({
        soBbLayMau: data.soBbLayMau,
        ngayLayMau: data.ngayLayMau,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenThuKho: data.thuKho,
        donViTinh: data.donViTinh,
        tenDonViTinh: data.tenDonViTinh
        // moTaHangHoa: data.moTaHangHoa,
        // tenThuKho: data.bbNhapDayKho.tenNguoiTao
      })
      if (!isChiTiet) {
        let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
        if (dmTieuChuan.data) {
          this.dataTableChiTieu = dmTieuChuan.data.children;
          this.dataTableChiTieu.forEach(element => {
            element.edit = false
          });
        }
      }
    }
  }

  async loadDanhMucPhuongThucBaoQuan() {
    let body = {
      maHthuc: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenHthuc: null,
      trangThai: null,
    };
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

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
}
