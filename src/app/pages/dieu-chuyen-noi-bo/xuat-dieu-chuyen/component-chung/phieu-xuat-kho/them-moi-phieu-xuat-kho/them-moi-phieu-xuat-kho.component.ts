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
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { PhieuXuatKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { PhieuKtraCluongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { PassDataXK } from '../phieu-xuat-kho.component';
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
  @Input() isView: boolean;
  @Input() passData: PassDataXK;
  @Input() isViewOnModal: boolean;

  @Output()
  showListEvent = new EventEmitter<any>();
  loaiVthh?: string[] | string;
  id: number;
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];

  listPhieuKNCl: any[] = [];

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
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private phieuXuatKhoDieuChuyenService: PhieuXuatKhoDieuChuyenService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuKiemNghiemChatLuongDieuChuyenService: PhieuKiemNghiemChatLuongDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoDieuChuyenService);
    this.formData = this.fb.group({
      id: [],
      type: ['00'],
      nam: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      tenMaDvi: ['', [Validators.required]],
      maQhns: [''],
      canBoLapPhieu: [''],
      canBoLapPhieuId: [''],
      soPhieuXuatKho: [''],
      ngayTaoPhieu: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayXuatKho: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      taiKhoanCo: [],
      taiKhoanNo: [],
      soQddc: ['', [Validators.required]],
      qddcId: ['', [Validators.required]],
      ngayKyQddc: ['', [Validators.required]],

      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: ['', [Validators.required]],
      tenLoKho: ['', [Validators.required]],

      soPhieuKnChatLuong: ['', [Validators.required]],
      phieuKnChatLuongHdrId: ['', [Validators.required]],
      ngayKyPhieuKnChatLuong: ['', [Validators.required]],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      ldChiCuc: [''],
      ldChiCucId: [''],
      ktvBaoQuanId: [''],
      ktvBaoQuan: [''],
      keToanTruong: [''],
      keToanTruongId: [''],
      nguoiGiaoHang: [''],
      soCmt: [''],
      ctyNguoiGh: [''],
      diaChi: [''],
      thoiGianGiaoNhan: [''],
      loaiHinhNX: ["Nhập ĐC nội bộ Chi cục"],
      kieuNX: ["Nhập không chi tiền"],
      soBangKeCh: [''],
      soLuongCanDc: [''],
      bangKeChId: [''],

      // thanhTien: [],
      // thanhTienBc: [''],
      // tongSoLuong: [],
      // tongSoLuongBc: [''],
      donViTinh: [''],
      donGia: [],
      duToanKinhPhiDc: [],

      dcnbPhieuXuatKhoDtl: [[]],
      ghiChu: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [],

    });
  }

  async ngOnInit() {
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.idInput) {
        await this.loadChiTiet();
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
      ...this.passData,
    });
    if (this.passData.qddcId) {
      this.bindingDataQd(this.passData.qddcId);
    }
    this.loadPhieuKiemNghiemCl(this.passData.phieuKnChatLuongHdrId);
  }

  async openDialogSoQdDC() {
    let dataQdDc = [];
    let body = {
      nam: dayjs().get('year'),
      isVatTu: this.isVatTu,
      loaiDc: this.loaiDc,
      thayDoiThuKho: this.thayDoiThuKho,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhDieuChuyenCucService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQdDc = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH ĐIỀU CHUYỂN',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQdDc,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdinh', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
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
          // let dataHd = await this.hopDongBttService.getDetail(data.idHd)
          // if (dataHd.data) {
          //   this.formData.patchValue({
          //     donGia: dataHd.data.donGiaBanTrucTiep,
          //   });
          // }
          this.listDiaDiemNhap = [];
          let dataChiCuc = [];
          if (Array.isArray(data?.danhSachQuyetDinh)) {
            data.danhSachQuyetDinh.forEach(element => {
              if (Array.isArray(element.danhSachKeHoach)) {
                element.danhSachKeHoach.forEach(item => {
                  if (item.maChiCucNhan == this.userInfo.MA_DVI && dataChiCuc.findIndex(f => f.maChiCucNhan == item.maChiCucNhan) < 0 && dataChiCuc.findIndex(f => f.maLoKho == item.maLoKho) < 0) {
                    dataChiCuc.push(item)
                  }
                });
              }
            });
          }
          if (dataChiCuc) {
            this.listDiaDiemNhap = cloneDeep(dataChiCuc);
            this.formData.patchValue({
              donViTinh: dataChiCuc[0]?.tenDonViTinh,
              duToanKinhPhiDc: dataChiCuc[0]?.duToanKphi
            })
          }
          // this.listPhieuXuatKho(data.soQdinh)
          // let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
          // if (dataChiCuc && dataChiCuc.length > 0) {
          //   dataChiCuc.forEach(e => {
          //     this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
          //   });
          //   this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
          // }
          this.dataTable.push({
            cloaiVthh: this.formData.value.cloaiVthh,
            duToanKinhPhiDc: this.formData.value.duToanKinhPhiDc,
            kinhPhiDc: 0,
            kinhPhiDcTt: 0,
            loaiVthh: this.formData.value.loaiVthh,
            maSo: "",
            donViTinh: this.formData.value.donViTinh,
            slDcThucTe: 0,
            tenCloaiVthh: this.formData.value.tenCloaiVthh,
            tenLoaiVthh: this.formData.value.tenLoaiVthh
          })
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

  async listPhieuXuatKho(even) {
    await this.spinner.show();
    let body = {
      soQddc: even,
      isVatTu: this.isVatTu,
      loaiDc: this.loaiDc,
      nam: this.formData.value.nam,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.phieuXuatKhoDieuChuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      this.phieuXuatKho = data.content;
      const diffList = [
        ...this.listDiaDiemNhap.filter((item) => {
          return !this.phieuXuatKho.some((child) => {
            if (child.maNganKho.length > 0 && item.maNganKho.length > 0) {
              return item.maNganKho === child.maNganKho;
            } else {
              return item.maDiemKho === child.maDiemKho;
            }
          });
        }),
      ];
      this.listDiaDiemNhap = diffList;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuongDc']
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
          soLuongCanDc: data.soLuongDc,
          donViTinh: data.tenDonViTinh,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh
        });
        await this.loadDSPhieuKNCluong(data);
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
      trangThai: STATUS.DA_DUYET_LDC,
    }
    let res = await this.phieuKiemNghiemChatLuongDieuChuyenService.dsPhieuKNChatLuong(body)
    if (res.data) {
      const list = res.data;
      this.listPhieuKNCl = list.filter(item => (item.maDiemKho == data.maDiemKho && item.maNhaKho == data.maNhaKho && item.maNganKho == data.maNganKho && item.maloKho == data.maLoKho));
      const dataPhieu = this.listPhieuKNCl[0]
      if (dataPhieu) {
        let resDetail = await this.phieuKiemNghiemChatLuongDieuChuyenService.getDetail(dataPhieu.id);
        if (resDetail.data) {
          const dataPhieuKn = resDetail.data;
          this.formData.patchValue({
            phieuKnChatLuongHdrId: dataPhieuKn.id,
            soPhieuKnChatLuong: dataPhieuKn.soPhieu,
            ngayKyPhieuKnChatLuong: dataPhieuKn.ngayDuyetLdCuc,
            donViTinh: dataPhieu.tenDonViTinh,
            ktvBaoQuan: dataPhieuKn.nguoiKt,
            ktvBaoQuanId: dataPhieuKn.nguoiKtId,
            duToanKinhPhiDc: data.duToanKphi
          });
          let dataObj = {
            // moTaHangHoa: this.loaiVthh?.startsWith('02') ? (this.formData.value.tenCloaiVthh ? this.formData.value.tenCloaiVthh : this.formData.value.tenLoaiVthh) : (this.formData.value.moTaHangHoa ? this.formData.value.moTaHangHoa : this.formData.value.tenCloaiVthh),
            cloaiVthh: this.formData.value.cloaiVthh,
            duToanKinhPhiDc: this.formData.value.duToanKinhPhiDc,
            kinhPhiDc: 0,
            kinhPhiDcTt: 0,
            loaiVthh: this.formData.value.loaiVthh,
            maSo: "",
            donViTinh: this.formData.value.donViTinh,
            slDcThucTe: 0,
            tenCloaiVthh: this.formData.value.tenCloaiVthh,
            tenLoaiVthh: this.formData.value.tenLoaiVthh
          }
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
  async createUpdate(body, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    await this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      let res = null;
      if (this.formData.value.id && this.formData.value.id > 0) {
        res = await this.phieuXuatKhoDieuChuyenService.update(body);
      } else {
        res = await this.phieuXuatKhoDieuChuyenService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (this.formData.value.id && this.formData.value.id > 0) {
          this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.UPDATE_SUCCESS);
          return res.data;
        } else {
          this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.ADD_SUCCESS);
          return res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        return null;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
    } finally {
      await this.spinner.hide();
    }

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
      body.thanhTienBc = this.convertTien(body.thanhTien, 'triệu đồng');
      body.dcnbPhieuXuatKhoDtl = this.dataTable;
      body.loaiDc = this.loaiDc,
        body.isVatTu = this.isVatTu,
        body.thayDoiThuKho = this.thayDoiThuKho
      let data = await this.createUpdate(body);
      if (data) {
        this.idInput = data.id;
        this.formData.patchValue({ id: data.id, soPhieuXuatKho: this.genSoPhieuXuat(data.id), trangThai: data.trangThai });
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

  async loadChiTiet() {
    let data = await this.detail(this.idInput);
    if (data) {
      this.fileDinhKems = data.fileDinhKems;
      this.dataTable = cloneDeep(data.dcnbPhieuXuatKhoDtl);
      this.formData.patchValue({ soPhieuXuatKho: this.genSoPhieuXuat(data.id) })
    }
  }
  genSoPhieuXuat(id) {
    if (this.formData.get('id').value) {
      return `${id}/PXK/DCNB`
    } else return ""
  }

  convertTien(tien: number, donVi: string): string {
    return (tien && Number(tien) > 0) ? `${convertTienTobangChu(tien)} (${donVi})` : '';
  }

  pheDuyet(isPheDuyet) {
    let trangThai = ''
    let msg = '';
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.TU_CHOI_LDCC:
        case STATUS.DU_THAO:
          trangThai = STATUS.CHO_DUYET_LDCC
          msg = 'Bạn có muốn gửi duyệt ?'
          break;
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.DA_DUYET_LDCC
          msg = 'Bạn có muốn duyệt bản ghi ?'
          break;
      }
      this.approve(this.formData.value.id, trangThai, msg);
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
      duToanKinhPhiDc: this.formData.value.duToanKinhPhiDc,
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
    return this.thanhTien
  }
  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
      return true;
    } else {
      return false;
    }
  }
  setValidate(isGuiDuyet: boolean) {
    if (isGuiDuyet) {
      this.formData.controls["nguoiGiaoHang"].setValidators([Validators.required]);
      this.formData.controls["soCmt"].setValidators([Validators.required]);
      this.formData.controls["ctyNguoiGh"].setValidators([Validators.required]);
      this.formData.controls["diaChi"].setValidators([Validators.required]);
      this.formData.controls["thoiGianGiaoNhan"].setValidators([Validators.required])
    } else {
      this.formData.controls["nguoiGiaoHang"].clearValidators();
      this.formData.controls["soCmt"].clearValidators();
      this.formData.controls["ctyNguoiGh"].clearValidators();
      this.formData.controls["diaChi"].clearValidators();
      this.formData.controls["thoiGianGiaoNhan"].clearValidators()
    }
  }

}
