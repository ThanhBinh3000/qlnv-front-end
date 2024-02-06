import { cloneDeep } from 'lodash';
import { PhieuXuatKhoDieuChuyenService } from './../../services/dcnb-xuat-kho.service';
import { PhieuKiemNghiemChatLuongDieuChuyenService } from './../../services/dcnb-phieu-kiem-nghiem-chat-luong.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { AbstractControl, Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { MA_QUYEN_PXK, PassDataXK } from '../phieu-xuat-kho.component';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { PREVIEW } from 'src/app/constants/fileType';
import { AMOUNT_TWO_DECIMAL } from 'src/app/Utility/utils';
@Component({
  selector: 'app-xuat-dcnb-them-moi-phieu-xuat-kho',
  templateUrl: './them-moi-phieu-xuat-kho.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho.component.scss']
})
export class ThemMoiPhieuXuatKhoDCNBComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() isVatTu: boolean;
  @Input() loaiDc: string;
  @Input() thayDoiThuKho: boolean;
  @Input() type: string;
  @Input() isView: boolean;
  @Input() passData: PassDataXK;
  @Input() isViewOnModal: boolean;
  @Input() MA_QUYEN: MA_QUYEN_PXK;
  @Output()
  showListEvent = new EventEmitter<any>();
  loaiVthh?: string[] | string;
  id: number;
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];

  taiLieuDinhKemList: any[] = [];
  dataTable: any[] = [];
  phieuXuatKho: any[] = [];
  tongSoLuong: number;
  thanhTien: number;
  fileDinhKems: any[];
  LIST_TRANG_THAI: { [key: string]: string } = {
    [this.STATUS.DU_THAO]: "Dự thảo",
    [this.STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
    [this.STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
    [this.STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
  }
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 4,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  amount1 = { ...AMOUNT_TWO_DECIMAL }
  maBb: string;
  TEN_KIEU_NHAP_XUAT: { [key: number]: any } = {
    1: "Nhập mua",
    2: "Nhập không chi tiền",
    3: "Xuất bán",
    4: "Xuất không thu tiền",
    5: "Khác"
  };
  previewName: string = "phieu_xuat_kho_lt_vt_xuat_dieu_chuyen";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private danhMucDungChungService: DanhMucDungChungService,
    private phieuXuatKhoDieuChuyenService: PhieuXuatKhoDieuChuyenService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuKiemNghiemChatLuongDieuChuyenService: PhieuKiemNghiemChatLuongDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoDieuChuyenService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      tenMaDvi: ['', [Validators.required]],
      maQhns: ['', [Validators.required]],
      canBoLapPhieu: ['', [Validators.required]],
      canBoLapPhieuId: ['', [Validators.required]],
      soPhieuXuatKho: [''],
      ngayTaoPhieu: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayXuatKho: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      taiKhoanCo: [''],
      taiKhoanNo: [''],
      soQddc: ['', [Validators.required]],
      qddcId: ['', [Validators.required]],
      ngayKyQddc: ['', [Validators.required]],

      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      tenNganLoKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],

      soPhieuKnChatLuong: ['', [Validators.required]],
      phieuKnChatLuongHdrId: ['', [Validators.required]],
      ngayKyPhieuKnChatLuong: ['', [Validators.required]],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: ['', [Validators.required]],
      tenCloaiVthh: ['', [Validators.required]],
      ldChiCuc: [''],
      ldChiCucId: [''],
      ktvBaoQuanId: ['', [Validators.required]],
      ktvBaoQuan: ['', [Validators.required]],
      keToanTruong: [''],
      keToanTruongId: [''],
      nguoiGiaoHang: ['', [Validators.required]],
      soCmt: ['', [Validators.required]],
      ctyNguoiGh: ['', [Validators.required]],
      diaChi: ['', [Validators.required]],
      thoiGianGiaoNhan: ['', [Validators.required]],
      // loaiHinhNX: [""],
      // kieuNX: [""],
      soBangKeCh: [''],
      bangKeChId: [''],
      soBangKeVt: [''],
      bangKeVtId: [''],
      soLuongCanDc: ['', [Validators.required, Validators.min(0)]],

      // thanhTien: [],
      // thanhTienBc: [''],
      // tongSoLuong: [],
      // tongSoLuongBc: [''],
      donViTinh: ['', [Validators.required]],
      duToanKpDc: [0, [Validators.required, Validators.min(0)]],

      ghiChu: [''],
      trangThai: [STATUS.DU_THAO, [Validators.required]],
      tenTrangThai: ['Dự Thảo', [Validators.required]],
      lyDoTuChoi: [],

      loaiHinhNhapXuat: ["", [Validators.required]],
      tenLoaiHinhNhapXuat: ["", [Validators.required]],
      kieuNhapXuat: ["", [Validators.required]],
      tenKieuNhapXuat: ["", [Validators.required]],
      keHoachDcDtlId: [, [Validators.required]]
    });
    this.maBb = 'PXK-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    try {
      if (this.isViewOnModal) {
        this.isView = true
      }
      this.setValidate()
      this.userInfo = this.userService.getUserLogin();
      if (this.loaiDc === "CHI_CUC") {
        this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '94' });
      } else if (this.loaiDc === "CUC") {
        this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '144' });
      } else {
        this.getLoaiHinhNhapXuat({ loai: 'LOAI_HINH_NHAP_XUAT', ma: '90' });
      }
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    // let id = await this.userService.getId('XH_PHIEU_XKHO_BTT_SEQ')
    this.formData.patchValue({
      // id: id,
      // soPhieuXuatKho: `${id}/${this.formData.get('nam').value}/PNK-CCDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenMaDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      canBoLapPhieu: this.userInfo.TEN_DAY_DU,
      canBoLapPhieuId: this.userInfo.ID,
      ...this.passData,
      tenNganLoKho: this.passData.tenLoKho ? `${this.passData.tenLoKho} - ${this.passData.tenNganKho}` : this.passData.tenNganKho,
    });
    if (this.passData.qddcId) {
      this.bindingDataQd(this.passData.qddcId, true);
    }
    this.loadPhieuKiemNghiemCl(this.passData.phieuKnChatLuongHdrId);
  }
  async getLoaiHinhNhapXuat(params) {
    try {
      const res = await this.danhMucDungChungService.search(params);
      if (res.msg === MESSAGE.SUCCESS) {
        const loaiHinhNhapXuat = res.data.content[0] ? { ...res.data.content[0] } : {};
        this.formData.patchValue({ loaiHinhNhapXuat: loaiHinhNhapXuat.ma, tenLoaiHinhNhapXuat: loaiHinhNhapXuat.giaTri, kieuNhapXuat: loaiHinhNhapXuat.ghiChu, tenKieuNhapXuat: this.TEN_KIEU_NHAP_XUAT[Number(loaiHinhNhapXuat.ghiChu)] })
      } else {
        this.notification.error(MESSAGE.ERROR, "Có lỗi xảy ra.")
      }

    } catch (error) {
      console.log("e", error);
      this.notification.error(MESSAGE.ERROR, "Có lỗi xảy ra.")
    }
  }
  async openDialogSoQdDC() {
    let dataQdDc = [];
    let body = {
      // nam: dayjs().get('year'), //TODO: Tam thoi khoa nam
      isVatTu: this.isVatTu,
      loaiDc: this.loaiDc,
      thayDoiThuKho: this.thayDoiThuKho,
      type: "00",
      trangThai: this.STATUS.BAN_HANH,
      // maDvi: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQdDc = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QUYẾT ĐỊNH XUẤT ĐIỀU CHUYỂN HÀNG HÓA',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQdDc,
        dataHeader: ['Số quyết định', 'Ngày ký quyết định'],
        dataColumn: ['soQdinh', 'ngayKyQdinh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        this.formData.patchValue({
          qddcId: '',
          soQddc: '',
          ngayKyQddc: '',
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

          soPhieuKnChatLuong: '',
          phieuKnChatLuongHdrId: '',
          ngayKyPhieuKnChatLuong: '',
          ktvBaoQuanId: '',
          ktvBaoQuan: '',

          soLuongCanDc: '',
          donViTinh: '',
          duToanKpDc: 0
        });
        this.dataTable = [];
        this.tongSoLuong = 0;
        this.thanhTien = 0;
        await this.bindingDataQd(dataChose.id, false);
      }
    });
  };

  async bindingDataQd(id: number, isFirst: boolean) {
    try {
      if (id > 0) {
        await this.spinner.show();
        let dataRes = await this.quyetDinhDieuChuyenCucService.getDetail(id)
        if (dataRes.msg == MESSAGE.SUCCESS) {
          const data = dataRes.data;
          this.formData.patchValue({
            qddcId: data.id,
            soQddc: data.soQdinh,
            ngayKyQddc: data.ngayKyQdinh,
          });
          this.listDiaDiemNhap = [];
          let dataChiCuc = [];

          if (data.maDvi == this.userInfo.MA_DVI && Array.isArray(data?.danhSachQuyetDinh)) {
            data.danhSachQuyetDinh.forEach(element => {
              if (Array.isArray(element?.dcnbKeHoachDcHdr?.danhSachHangHoa)) {
                element.dcnbKeHoachDcHdr.danhSachHangHoa.forEach(item => {
                  // if (dataChiCuc.findIndex(f => ((!f.maLoKho && !item.maLoKho && item.maNganKho && f.maNganKho == item.maNganKho) || (f.maLoKho && f.maLoKho == item.maLoKho))) < 0) {
                  //   dataChiCuc.push(item)
                  // }
                  if (item.thayDoiThuKho === this.thayDoiThuKho) {
                    dataChiCuc.push(item)
                  }
                });
              }
            });
          }
          if (dataChiCuc) {
            // this.listDiaDiemNhap = cloneDeep(dataChiCuc);
            this.listDiaDiemNhap = dataChiCuc.map(f => ({ ...f, noiNhan: `${f.tenDiemKhoNhan || ""} - ${f.tenNhaKhoNhan || ""} - ${f.tenNganKhoNhan || ""} - ${f.tenLoKhoNhan || ""}` }));

            // this.formData.patchValue({
            //   donViTinh: dataChiCuc[0]?.donViTinh,
            //   duToanKpDc: dataChiCuc[0]?.duToanKphi
            // })
          };
          if (isFirst) {
            const maLoKho = this.formData.value.maLoKho;
            const maNganKho = this.formData.value.maNganKho;
            const maNganLoKho = maLoKho ? `${maNganKho}${maLoKho}` : maNganKho;
            const dataNganLo = this.listDiaDiemNhap.find(f => {
              const maNganLo = f.maLoKho ? `${f.maNganKho}${f.maLoKho}` : f.maNganKho;
              return maNganLo === maNganLoKho;
            });
            if (dataNganLo) {
              this.formData.patchValue({
                donViTinh: dataNganLo.donViTinh,
                duToanKpDc: dataNganLo.duToanKphi || 0
              })
            }
            this.dataTable = [];
            this.dataTable.push({
              cloaiVthh: this.formData.value.cloaiVthh,
              duToanKinhPhiDc: 0,
              kinhPhiDc: 0,
              kinhPhiDcTt: 0,
              loaiVthh: this.formData.value.loaiVthh,
              maSo: "",
              donViTinh: this.formData.value.donViTinh,
              slDcThucTe: 0,
              tenCloaiVthh: this.formData.value.tenCloaiVthh,
              tenLoaiVthh: this.formData.value.tenLoaiVthh
            })
          }
        } else {
          this.notification.error(MESSAGE.ERROR, dataRes.msg);
        }
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      await this.spinner.hide();
    }
  }

  // async listPhieuXuatKho(even) {
  //   await this.spinner.show();
  //   let body = {
  //     soQddc: even,
  //     isVatTu: this.isVatTu,
  //     loaiDc: this.loaiDc,
  //     thayDoiThuKho: this.thayDoiThuKho,
  //     type: this.type,
  //     nam: this.formData.value.nam,
  //     maDvi: this.userInfo.MA_DVI,
  //   }
  //   let res = await this.phieuXuatKhoDieuChuyenService.search(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     const data = res.data
  //     this.phieuXuatKho = data.content;
  //     const diffList = [
  //       ...this.listDiaDiemNhap.filter((item) => {
  //         return !this.phieuXuatKho.some((child) => {
  //           if (child.maNganKho.length > 0 && item.maNganKho.length > 0) {
  //             return item.maNganKho === child.maNganKho;
  //           } else {
  //             return item.maDiemKho === child.maDiemKho;
  //           }
  //         });
  //       }),
  //     ];
  //     this.listDiaDiemNhap = diffList;
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  openDialogDdiemXuatHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho xuất', 'Nhà kho xuất', 'Ngăn kho xuất', 'Lô kho xuất', 'Số lượng điều chuyển', 'Nơi nhận'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuongDc', 'noiNhan']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.dataTable = [];
        this.formData.patchValue({
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
          soLuongCanDc: data.soLuongDc || 0,
          donViTinh: data.donViTinh,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          duToanKpDc: data.duToanKphi || 0,
          keHoachDcDtlId: data.id,

          soPhieuKnChatLuong: '',
          phieuKnChatLuongHdrId: '',
          ngayKyPhieuKnChatLuong: '',
          ktvBaoQuanId: '',
          ktvBaoQuan: '',
        });
        this.dataTable = [];
        this.tongSoLuong = 0;
        this.thanhTien = 0;
        if (this.thayDoiThuKho) {
          await this.loadDSPhieuKNCluong(data);
        } else {
          let dataObj = {
            // moTaHangHoa: this.loaiVthh?.startsWith('02') ? (this.formData.value.tenCloaiVthh ? this.formData.value.tenCloaiVthh : this.formData.value.tenLoaiVthh) : (this.formData.value.moTaHangHoa ? this.formData.value.moTaHangHoa : this.formData.value.tenCloaiVthh),
            cloaiVthh: this.formData.value.cloaiVthh,
            duToanKinhPhiDc: 0,
            kinhPhiDc: 0,
            kinhPhiDcTt: 0,
            loaiVthh: this.formData.value.loaiVthh,
            maSo: "",
            donViTinh: this.formData.value.donViTinh,
            slDcThucTe: 0,
            tenCloaiVthh: this.formData.value.tenCloaiVthh,
            tenLoaiVthh: this.formData.value.tenLoaiVthh
          };
          this.dataTable = [];
          this.dataTable.push(dataObj);
        }
      }
    });
  }
  async loadPhieuKiemNghiemCl(phieuKnChatLuongHdrId) {
    if (phieuKnChatLuongHdrId) {
      const res = await this.phieuKiemNghiemChatLuongDieuChuyenService.getDetail(phieuKnChatLuongHdrId);
      if (res.data) {
        this.formData.patchValue({ ktvBaoQuan: res.data.nguoiKt, ktvBaoQuanId: res.data.nguoiKtId, ngayKyPhieuKnChatLuong: res.data.ngayDuyetLdCuc })
      }
    };
  }
  async loadDSPhieuKNCluong(data) {
    let body = {
      loaiDc: this.loaiDc,
      soQdinhDcc: this.formData.value.soQddc,
      isVatTu: this.isVatTu,
      thayDoiThuKho: this.thayDoiThuKho,
      type: this.type,
      trangThai: STATUS.DA_DUYET_LDC,
    }
    let res = await this.phieuKiemNghiemChatLuongDieuChuyenService.dsPhieuKNChatLuong(body)
    if (res.data) {
      const list = res.data;
      const dataPhieu = list.find(item => (item.maDiemKho == data.maDiemKho && item.maNhaKho == data.maNhaKho && item.maNganKho == data.maNganKho && ((!item.maLoKho && !data.maLoKho) || (item.maLoKho && item.maLoKho == data.maLoKho))));
      if (dataPhieu) {
        let resDetail = await this.phieuKiemNghiemChatLuongDieuChuyenService.getDetail(dataPhieu.id);
        if (resDetail.data) {
          const dataPhieuKn = resDetail.data;
          this.formData.patchValue({
            phieuKnChatLuongHdrId: dataPhieuKn.id,
            soPhieuKnChatLuong: dataPhieuKn.soPhieu,
            ngayKyPhieuKnChatLuong: dataPhieuKn.ngayDuyetLdCuc,
            donViTinh: dataPhieu.donViTinh,
            ktvBaoQuan: dataPhieuKn.nguoiKt,
            ktvBaoQuanId: dataPhieuKn.nguoiKtId,
            // duToanKpDc: data.duToanKphi
          });
          let dataObj = {
            // moTaHangHoa: this.loaiVthh?.startsWith('02') ? (this.formData.value.tenCloaiVthh ? this.formData.value.tenCloaiVthh : this.formData.value.tenLoaiVthh) : (this.formData.value.moTaHangHoa ? this.formData.value.moTaHangHoa : this.formData.value.tenCloaiVthh),
            cloaiVthh: this.formData.value.cloaiVthh,
            duToanKinhPhiDc: 0,
            kinhPhiDc: 0,
            kinhPhiDcTt: 0,
            loaiVthh: this.formData.value.loaiVthh,
            maSo: "",
            donViTinh: this.formData.value.donViTinh,
            slDcThucTe: 0,
            tenCloaiVthh: this.formData.value.tenCloaiVthh,
            tenLoaiVthh: this.formData.value.tenLoaiVthh
          };
          this.dataTable = [];
          this.dataTable.push(dataObj);
        }
      }
    }
  }

  async logdataTable() {
    this.dataTable.forEach(s => {
      this.formData.patchValue({
        soLuongThucXuat: s.soLuongThucXuat,
        maSo: s.maSo,
        soLuongChungTu: s.soLuongChungTu
      });
    })
  }

  hasDuplicateMaso(arr) {
    return arr.some((item, index) => {
      return arr.findIndex(otherItem => otherItem.maSo === item.maSo) !== index;
    });
  }
  async save(isGuiDuyet?: boolean) {
    try {
      this.setValidate(isGuiDuyet)
      this.helperService.markFormGroupTouched(this.formData);
      if (!this.formData.valid) return;
      if (this.hasDuplicateMaso(this.dataTable)) return this.notification.error(MESSAGE.ERROR, "Có 2 mã số trùng nhau");
      let body = this.formData.value;
      body.fileDinhKems = this.fileDinhKems;
      body.tongSoLuong = this.tongSoLuong;
      body.tongSoLuongBc = this.convertTien(body.tongSoLuong, body.donViTinh);
      body.thanhTien = this.thanhTien;
      body.thanhTienBc = this.convertTien(body.thanhTien * 1000000, 'VNĐ');
      body.dcnbPhieuXuatKhoDtl = this.dataTable;
      body.loaiDc = this.loaiDc;
      body.isVatTu = this.isVatTu;
      body.thayDoiThuKho = this.thayDoiThuKho;
      body.type = this.type;
      body.loaiQdinh = this.loaiDc === "CUC" ? "XUAT" : undefined;
      let data = await this.createUpdate(body, null, isGuiDuyet);
      if (data) {
        this.formData.patchValue({ id: data.id, soPhieuXuatKho: data.soPhieuXuatKho, trangThai: data.trangThai });
        if (isGuiDuyet) {
          this.pheDuyet(true);
        }
        // else {
        //   this.goBack();
        // }
      }
    } catch (error) {
      console.log("error", error)
    }
    // this.logdataTable();
  }

  async loadChiTiet(idInput: number) {
    let data = await this.detail(idInput);
    if (data) {
      this.fileDinhKems = data.fileDinhKems;
      this.dataTable = cloneDeep(data.dcnbPhieuXuatKhoDtl);
      this.formData.patchValue({ soPhieuXuatKho: data.soPhieuXuatKho, tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho })
    }
  }
  genSoPhieuXuat(id: number) {
    return `${id}/${this.formData.value.nam}/${this.maBb}`
  }

  convertTien(tien: number, donVi: string): string {
    return (tien && Number(tien) > 0) ? `${convertTienTobangChu(tien)} (${donVi})` : '';
  }

  pheDuyet(isPheDuyet: boolean) {
    let trangThai = ''
    let msg = '';
    let MSG = '';
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.TU_CHOI_LDCC:
        case STATUS.DU_THAO:
          trangThai = STATUS.CHO_DUYET_LDCC
          msg = 'Bạn có muốn gửi duyệt ?'
          MSG = MESSAGE.GUI_DUYET_SUCCESS
          break;
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.DA_DUYET_LDCC
          msg = 'Bạn có muốn duyệt bản ghi ?'
          MSG = MESSAGE.PHE_DUYET_SUCCESS
          break;
      }
      this.approve(this.formData.value.id, trangThai, msg, null, MSG);
    } else {
      switch (this.formData.value.trangThai) {
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.TU_CHOI_LDCC
          break;
      }
      this.reject(this.formData.value.id, trangThai)
    }
  }

  clearItemRow(i) {
    this.dataTable[i] = {};
  }
  addItemRow() {
    this.dataTable.push({
      cloaiVthh: this.formData.value.cloaiVthh,
      duToanKinhPhiDc: 0,
      kinhPhiDc: 0,
      kinhPhiDcTt: 0,
      loaiVthh: this.formData.value.loaiVthh,
      maSo: "",
      donViTinh: this.formData.value.donViTinh,
      slDcThucTe: 0,
      tenCloaiVthh: this.formData.value.tenCloaiVthh,
      tenLoaiVthh: this.formData.value.tenLoaiVthh
    })
  }
  deleteItemRow(i) {
    this.dataTable.splice(i, 1)
  }
  tinhTongSoLuong(data) {
    this.tongSoLuong = data.reduce((sum, cur) => sum += (!isNaN(cur.slDcThucTe) ? cur.slDcThucTe : 0), 0);
    return this.tongSoLuong
  };
  tinhTongKinhPhi(data) {
    this.thanhTien = data.reduce((sum, cur) => sum += (!isNaN(cur.kinhPhiDcTt) ? cur.kinhPhiDcTt : 0), 0)
    return this.thanhTien * 1000000
  }
  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC || this.isView) {
      return true;
    } else {
      return false;
    }
  }
  setValidate(isGuiDuyet?: boolean) {
    if (!this.thayDoiThuKho) {
      this.formData.controls['soPhieuKnChatLuong'].clearValidators();
      this.formData.controls['phieuKnChatLuongHdrId'].clearValidators();
      this.formData.controls['ngayKyPhieuKnChatLuong'].clearValidators();
      this.formData.controls['ktvBaoQuan'].clearValidators();
      this.formData.controls['ktvBaoQuanId'].clearValidators();
    }
    if (isGuiDuyet) {
      if (this.isVatTu) {
        this.formData.controls["bangKeVtId"].setValidators([Validators.required]);
        this.formData.controls["soBangKeVt"].setValidators([Validators.required]);
      } else {
        this.formData.controls["bangKeChId"].setValidators([Validators.required]);
        this.formData.controls["soBangKeCh"].setValidators([Validators.required]);
      }
    } else {
      this.formData.controls["bangKeVtId"].clearValidators();
      this.formData.controls["soBangKeVt"].clearValidators();
      this.formData.controls["bangKeChId"].clearValidators();
      this.formData.controls["soBangKeCh"].clearValidators();
    }
  };
  getRequired(controlName: string): boolean {
    if (this.formData.controls[controlName].validator) {
      return true
    }
    return false
  }
  // setValidate(isGuiDuyet: boolean) {
  //   if (!this.thayDoiThuKho) {
  //     this.formData.controls['soPhieuKnChatLuong'].clearValidators();
  //     this.formData.controls['phieuKnChatLuongHdrId'].clearValidators();
  //     this.formData.controls['ngayKyPhieuKnChatLuong'].clearValidators();
  //   }
  //   if (isGuiDuyet) {
  //     this.formData.controls["nguoiGiaoHang"].setValidators([Validators.required]);
  //     this.formData.controls["soCmt"].setValidators([Validators.required]);
  //     this.formData.controls["ctyNguoiGh"].setValidators([Validators.required]);
  //     this.formData.controls["diaChi"].setValidators([Validators.required]);
  //     this.formData.controls["thoiGianGiaoNhan"].setValidators([Validators.required]);
  //     if (this.isVatTu) {
  //       this.formData.controls["bangKeVtId"].setValidators([Validators.required]);
  //       this.formData.controls["soBangKeVt"].setValidators([Validators.required]);
  //     } else {
  //       this.formData.controls["bangKeChId"].setValidators([Validators.required]);
  //       this.formData.controls["soBangKeCh"].setValidators([Validators.required]);
  //     }
  //   } else {
  //     this.formData.controls["nguoiGiaoHang"].clearValidators();
  //     this.formData.controls["soCmt"].clearValidators();
  //     this.formData.controls["ctyNguoiGh"].clearValidators();
  //     this.formData.controls["diaChi"].clearValidators();
  //     this.formData.controls["thoiGianGiaoNhan"].clearValidators();
  //   }
  // }
}
