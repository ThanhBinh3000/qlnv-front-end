import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Validators} from "@angular/forms";
import {chiTietBangKeCanHangBdg} from "src/app/models/KeHoachBanDauGia";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {DonviService} from "src/app/services/donvi.service";
import {QuanLyHangTrongKhoService} from "src/app/services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import {MESSAGE} from "src/app/constants/message";
import {STATUS} from 'src/app/constants/status';
import {Base2Component} from "src/app/components/base2/base2.component";

import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  PhieuXuatKhoService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service';
import {
  BangKeCanService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BangKeCan.service';
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {convertTienTobangChu} from "../../../../../../shared/commonFunction";
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {
  BbNghiemThuBaoQuanService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-bdg-chi-tiet-bang-ke-can',
  templateUrl: './chi-tiet-bang-ke-can.component.html',
  styleUrls: ['./chi-tiet-bang-ke-can.component.scss']
})
export class ChiTietBangKeCanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  dataTableChange = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  dataQuyetDinh: any[] = [];
  listPhieuXuatKho: any[] = [];
  listDiaDiemXuat: any[] = [];
  loadDanhSachBangKeCan: any[] = [];
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bangKeCanService: BangKeCanService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year'), [Validators.required]],
        maDvi: [''],
        maQhNs: [''],
        soBangKeHang: [''],
        ngayLapBangKe: [''],
        idQdNv: [],
        soQdNv: [''],
        ngayKyQdNv: [''],
        idQdNvDtl: [],
        idHopDong: [],
        soHopDong: [''],
        ngayKyHopDong: [''],
        idKho: [],
        maDiemKho: [''],
        diaDiemKho: [''],
        maNhaKho: [''],
        maNganKho: [''],
        maLoKho: [''],
        loaiHinhKho: [''],
        nguoiGiamSat: [''],
        idThuKho: [],
        idLanhDaoChiCuc: [],
        idPhieuXuatKho: [],
        soPhieuXuatKho: [''],
        ngayXuatKho: [''],
        idPhieuKiemNghiem: [],
        soPhieuKiemNghiem: [''],
        ngayKiemNghiemMau: [''],
        tenNguoiGiao: [''],
        cmtNguoiGiao: [''],
        congTyNguoiGiao: [''],
        diaChiNguoiGiao: [''],
        thoiGianGiaoNhan: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        tenHangHoa: [''],
        donViTinh: [''],
        tongTrongLuongBi: [],
        tongTrongLuongCaBi: [],
        tongTrongTruBi: [],
        loaiHinhNx: [''],
        kieuNhapXuat: [''],
        soLuong: [''],
        donGia: [''],
        trangThai: [''],
        lyDoTuChoi: [''],
        tenDvi: [''],
        tenDiemKho: [''],
        tenNhaKho: [''],
        tenNganKho: [''],
        tenLoKho: [''],
        tenNganLoKho: [''],
        tenThuKho: [''],
        tenLanhDaoChiCuc: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenLoaiHinhNx: [''],
        tenKieuNhapXuat: [''],
        tenTrangThai: [''],
        fileDinhKem: [new Array<FileDinhKem>()],
      }
    );
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/BKCH-' + this.userInfo.DON_VI.tenVietTat;
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
      this.emitDataTable()
      this.updateEditCache()
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    this.maTuSinh = await this.userService.getId('XH_DG_BANG_KE_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBangKeHang: `${this.maTuSinh}/${this.formData.get('nam').value}${this.maHauTo}`,
      ngayLapBangKe: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      tongTrongLuongCaBi: 0,
    })
  }

  async onChangeNam(event) {
    if (event) {
      this.formData.patchValue({
        soBangKeHang: `${this.maTuSinh}/${event}${this.maHauTo}`,
      });
    }
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id);
    if (!data) {
      console.error('Không tìm thấy dữ liệu');
      return;
    }
    this.maTuSinh = this.idInput;
    this.dataTable = data.children
    if (!this.isView) {
      await this.onChange(data.idQdNv)
    }
  }

  async openDialog() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        nam: this.formData.value.nam,
        trangThai: STATUS.BAN_HANH
      }
      const res = await this.quyetDinhGiaoNhiemVuXuatHangService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.dataQuyetDinh = res.data.content.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dataQuyetDinh,
          dataHeader: ['Số quyết định giao nhiệm vụ', 'Ngày ký', 'Loại hàng hóa'],
          dataColumn: ['soQdNv', 'ngayKy', 'tenLoaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChange(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async changeSoQdNv(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdNv) {
      this.formData.patchValue({
        idQdNvDtl: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        idKho: null,
        maDiemKho: null,
        tenDiemKho: null,
        diaDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenNganLoKho: null,
        loaiHinhKho: null,
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuatKho: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        thoiGianGiaoNhan: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
        loaiHinhNx: null,
        kieuNhapXuat: null,
        soLuong: null,
        donGia: null,
      });
      this.dataTable = [];
    }
  }

  async onChange(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.quyetDinhGiaoNhiemVuXuatHangService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        nam: data.nam,
        idQdNv: data.id,
        soQdNv: data.soQdNv,
        ngayKyQdNv: data.ngayKy,
        idHopDong: data.idHopDong,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
        loaiHinhNx: data.loaiHinhNx,
        kieuNhapXuat: data.kieuNhapXuat,
      });
      await this.loadBangKeCanHang(data.soQdNv)
      const dataChiCuc = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
      if (dataChiCuc && dataChiCuc.children && dataChiCuc.children.length > 0) {
        this.listDiaDiemXuat = dataChiCuc.children
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadBangKeCanHang(event) {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.bangKeCanService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachBangKeCan = data;
  }

  async openDialogKho() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemXuat,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idKho: data.id,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          diaDiemKho: data.diaDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho
        });
        await this.loadLoaiHinhKho(data);
      }
    });
  }

  async changeKho(event) {
    if (this.flagInit && event && event !== this.formData.value.maLoKho && this.formData.value.maNganKho) {
      this.formData.patchValue({
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuatKho: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        thoiGianGiaoNhan: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
        loaiHinhNx: null,
        kieuNhapXuat: null,
        soLuong: null,
        donGia: null,
      })
      this.dataTable = [];
    }
  }

  async loadLoaiHinhKho(kho) {
    if (!kho) {
      return
    }
    let maKho = kho.maLoKho || kho.maNganKho
    let res = await this.bbNghiemThuBaoQuanService.getDataKho(maKho);
    if (res.msg !== MESSAGE.SUCCESS || !res.data) {
      return;
    }
    this.formData.patchValue({
      loaiHinhKho: res.data.lhKho
    });
  }

  async openDialogPhieuXuatKho() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        nam: this.formData.value.nam,
        trangThai: STATUS.DU_THAO,
        soQdNv: this.formData.value.soQdNv,
      }
      const res = await this.phieuXuatKhoService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        const phieuXuatKhoSet = new Set(this.loadDanhSachBangKeCan.map(item => item.soPhieuXuatKho));
        this.listPhieuXuatKho = res.data.content.filter(item => !phieuXuatKhoSet.has(item.soPhieuXuatKho))
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      const formattedDataPhieuXuatKho = this.listPhieuXuatKho.map(item => ({
        soLuongXuat: item.thucXuat.toLocaleString(),
        ...item
      }))
      const modalQD = this.modal.create({
        nzTitle: 'PHIẾU XUẤT KHO HÀNG DTQG',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: formattedDataPhieuXuatKho.filter(item => item.idKho === this.formData.value.idKho),
          dataHeader: ['Số Phiếu xuất kho', 'Ngày Lập Phiếu', 'Loại hàng hóa', 'Số lượng xuất kho'],
          dataColumn: ['soPhieuXuatKho', 'ngayLapPhieu', 'tenLoaiVthh', 'soLuongXuat']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangePhieuXuatKho(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async changePhieuXuatKho(event) {
    if (this.flagInit && event && event !== this.formData.value.soPhieuXuatKho) {
      this.formData.patchValue({
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        thoiGianGiaoNhan: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
        loaiHinhNx: null,
        kieuNhapXuat: null,
        soLuong: null,
        donGia: null,
      })
      this.dataTable = [];
    }
  }

  async onChangePhieuXuatKho(id) {
    if (id <= 0) {
      return;
    }
    try {
      const res = await this.phieuXuatKhoService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data
      this.formData.patchValue({
        idQdNvDtl: data.idQdNvDtl,
        idPhieuXuatKho: data.id,
        soPhieuXuatKho: data.soPhieuXuatKho,
        ngayXuatKho: data.ngayLapPhieu,
        tenNguoiGiao: data.tenNguoiGiao,
        cmtNguoiGiao: data.cmtNguoiGiao,
        congTyNguoiGiao: data.congTyNguoiGiao,
        diaChiNguoiGiao: data.diaChiNguoiGiao,
        thoiGianGiaoNhan: data.thoiGianGiaoNhan,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        soLuong: data.thucXuat,
        donGia: data.donGia,
        donViTinh: data.donViTinh,
        idPhieuKiemNghiem: data.idPhieuKiemNghiem,
        soPhieuKiemNghiem: data.soPhieuKiemNghiem,
        ngayKiemNghiemMau: data.ngayKiemNghiemMau,
      })
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  rowItem: chiTietBangKeCanHangBdg = new chiTietBangKeCanHangBdg();
  dataEdit: { [key: string]: { edit: boolean; data: chiTietBangKeCanHangBdg } } = {};

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  updateEditCache(): void {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataEdit = {};
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index.toString()] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  addRow() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.dataTable.push(this.rowItem);
    this.rowItem = new chiTietBangKeCanHangBdg();
    this.emitDataTable();
    this.updateEditCache();
    this.formData.patchValue({
      tongTrongLuongCaBi: this.dataTable.reduce((prev, cur) => prev + cur.trongLuongCaBi, 0),
    });
  }

  clearItemRow() {
    this.rowItem = new chiTietBangKeCanHangBdg();
    this.rowItem.id = null;
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  deleteRow(index: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
          this.updateEditCache();
          this.formData.patchValue({
            tongTrongLuongCaBi: this.dataTable.reduce((prev, cur) => prev + cur.trongLuongCaBi, 0),
          });
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEdit(idx: number): void {
    const editedData = this.dataEdit[idx].data;
    if (editedData) {
      Object.assign(this.dataTable[idx], editedData);
      this.dataEdit[idx].edit = false;
    }
    this.formData.patchValue({
      tongTrongLuongCaBi: this.dataTable.reduce((prev, cur) => prev + cur.trongLuongCaBi, 0),
    });
  }

  cancelEdit(stt: number): void {
    if (this.dataTable[stt] && this.dataEdit[stt]) {
      this.dataEdit[stt] = {
        data: {...this.dataTable[stt]},
        edit: false,
      };
    }
  }

  calcTong(columnName) {
    if (!this.dataTable) return 0;
    return this.dataTable.reduce((sum, cur) => sum + (cur[columnName] || 0), 0);
  }

  changeTong(event) {
    if (event > 0) {
      this.formData.patchValue({
        tongTrongTruBi: this.formData.value.tongTrongLuongCaBi - event,
      });
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
      this.formData.controls["soPhieuXuatKho"].setValidators([Validators.required]);
      this.formData.controls["soBangKeHang"].setValidators([Validators.required]);
      const body = {
        ...this.formData.value,
        children: this.dataTable,
      };
      await this.createUpdate(body);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.setValidForm();
      const body = {
        ...this.formData.value,
        children: this.dataTable,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  setValidForm() {
    const requiredFields = [
      "nam",
      "tenDvi",
      "maQhNs",
      "ngayLapBangKe",
      "soHopDong",
      "ngayKyHopDong",
      "tenNganLoKho",
      "tenNhaKho",
      "tenDiemKho",
      "diaDiemKho",
      "nguoiGiamSat",
      "tenThuKho",
      "tenNguoiGiao",
      "cmtNguoiGiao",
      "congTyNguoiGiao",
      "diaChiNguoiGiao",
      "thoiGianGiaoNhan",
      "tenLoaiVthh",
      "tenCloaiVthh",
      "donViTinh",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }

  async preview(id) {
    await this.bangKeCanService.preview({
      tenBaoCao: 'Bảng kê cân hàng bán đấu giá',
      id: id
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.printSrc = res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }
}
