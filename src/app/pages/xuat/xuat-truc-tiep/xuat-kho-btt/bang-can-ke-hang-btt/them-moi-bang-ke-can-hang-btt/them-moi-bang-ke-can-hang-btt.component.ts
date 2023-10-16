import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {Validators} from "@angular/forms";
import {STATUS, TRUC_TIEP} from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {
  PhieuXuatKhoBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {
  BangCanKeHangBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bang-can-ke-hang-btt.service';
import {DonviService} from 'src/app/services/donvi.service';
import {chiTietBangCanKeHang} from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {BangKeBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {chiTietBangKeCanHangBdg} from "../../../../../../models/KeHoachBanDauGia";

@Component({
  selector: 'app-them-moi-bang-ke-can-hang-btt',
  templateUrl: './them-moi-bang-ke-can-hang-btt.component.html',
  styleUrls: ['./them-moi-bang-ke-can-hang-btt.component.scss']
})
export class ThemMoiBangKeCanHangBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  dataTableChange = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  TRUC_TIEP = TRUC_TIEP;
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  danhSachQuyetDinh: any[] = [];
  listDiaDiemXuat: any[] = [];
  loadDanhSachHopDong: any[] = [];
  loadDanhSachBangKeCan: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private phieuXuatKhoBttService: PhieuXuatKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private bangCanKeHangBttService: BangCanKeHangBttService,
    private hopDongBttService: HopDongBttService,
    private bangKeBttService: BangKeBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCanKeHangBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      maDvi: [''],
      maQhNs: [''],
      soBangKeHang: [''],
      ngayLapBangKe: [''],
      idQdNv: [],
      soQdNv: [''],
      ngayKyQdNv: [''],
      maDiemKho: [''],
      diaDiemKho: [''],
      maNhaKho: [''],
      maNganKho: [''],
      maLoKho: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      donViTinh: [''],
      idPhieuXuatKho: [],
      soPhieuXuatKho: [''],
      ngayXuatKho: [''],
      tgianGiaoNhan: [''],
      idThuKho: [],
      idLanhDaoChiCuc: [],
      idPhieuKiemNghiem: [],
      soPhieuKiemNghiem: [''],
      ngayKiemNghiemMau: [''],
      tenNguoiGiao: [''],
      cmtNguoiGiao: [''],
      congTyNguoiGiao: [''],
      diaChiNguoiGiao: [''],
      idHopDong: [],
      soHopDong: [''],
      ngayKyHopDong: [''],
      soLuongHopDong: [],
      idBangKeBanLe: [],
      soBangKeBanLe: [''],
      ngayTaoBkeBanLe: [''],
      soLuongBkeBanLe: [],
      tongTrongLuongBi: [],
      tongTrongLuongCaBi: [],
      tongTrongTruBi: [],
      loaiHinhNx: [''],
      kieuNx: [''],
      pthucBanTrucTiep: [''],
      phanLoai: [''],
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
      tenKieuNx: [''],
      tenTrangThai: [''],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
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
    this.maTuSinh = await this.userService.getId('XH_BKE_CAN_HANG_BTT_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBangKeHang: `${this.maTuSinh}/${this.formData.get('namKh').value}${this.maHauTo}`,
      ngayLapBangKe: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      phanLoai: TRUC_TIEP.HOP_DONG
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
    this.dataTable = data.children
  }

  async openDialog() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        namKh: this.formData.value.namKh,
        trangThai: STATUS.BAN_HANH
      }
      const res = await this.quyetDinhNvXuatBttService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.danhSachQuyetDinh = res.data.content.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      } else if (res && res.msg) {
        this.notification.error(MESSAGE.ERROR, res.msg);
      } else {
        this.notification.error(MESSAGE.ERROR, 'Unknown error occurred.');
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.danhSachQuyetDinh,
          dataHeader: ['Số quyết định giao nhiệm vụ', 'Ngày ký', 'Loại hàng hóa'],
          dataColumn: ['soQdNv', 'ngayKyQdNv', 'tenLoaiVthh']
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

  changeSoQdNv(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdNv) {
      this.formData.patchValue({
        maDiemKho: null,
        tenDiemKho: null,
        diaDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuatKho: null,
        tgianGiaoNhan: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        soLuongHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        soLuongBkeBanLe: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
      });
      this.dataTable = [];
    }
  }

  async onChange(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.quyetDinhNvXuatBttService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        namKh: data.namKh,
        idQdNv: data.id,
        soQdNv: data.soQdNv,
        ngayKyQdNv: data.ngayKyQdNv,
      });
      await this.loadBangKeCanHang(data.soQdNv)
      const dataChiCuc = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
      this.listDiaDiemXuat = dataChiCuc?.children
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
    const res = await this.bangCanKeHangBttService.search(body)
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
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho
        });
        await this.loadDiaDiemKhoForItem(data)
        await this.loadDanhDachPhieuXuatKho(data);
      }
    });
  }

  async loadDiaDiemKhoForItem(item) {
    const res = await this.donViService.getAll({
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI
    });
    const diaDiemKho = res.data.find(s => s.maDvi === item.maDiemKho);
    if (diaDiemKho) {
      this.formData.patchValue({
        diaDiemKho: diaDiemKho.diaChi
      })
    }
  }

  changeKho(event) {
    if (this.flagInit && event && event !== this.formData.value.maLoKho && this.formData.value.maNganKho) {
      this.formData.patchValue({
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuatKho: null,
        tgianGiaoNhan: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        soLuongHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        soLuongBkeBanLe: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
      })
      this.dataTable = [];
    }
  }

  async loadDanhDachPhieuXuatKho(kho) {
    let body = {
      loaiVthh: this.loaiVthh,
      nam: this.formData.value.nam,
      trangThai: STATUS.DU_THAO,
      soQdNv: this.formData.value.soQdNv,
    }
    const res = await this.phieuXuatKhoBttService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    const filterConditions = {
      maDiemKho: kho.maDiemKho,
      maNhaKho: kho.maNhaKho,
      maNganKho: kho.maNganKho,
      maLoKho: kho.maLoKho,
    };
    const filteredData = data.filter(item =>
      Object.keys(filterConditions).every(key =>
        item[key] === filterConditions[key]
      )
    );
    if (filteredData.length > 0) {
      const firstItem = filteredData.find(item => !this.loadDanhSachBangKeCan.some(loadItem => loadItem.soPhieuXuatKho === item.soPhieuXuatKho));
      this.formData.patchValue({
        loaiVthh: firstItem.loaiVthh,
        tenLoaiVthh: firstItem.tenLoaiVthh,
        cloaiVthh: firstItem.cloaiVthh,
        tenCloaiVthh: firstItem.tenCloaiVthh,
        tenHangHoa: firstItem.tenHangHoa,
        donViTinh: firstItem.donViTinh,
        idPhieuXuatKho: firstItem.id,
        soPhieuXuatKho: firstItem.soPhieuXuatKho,
        ngayXuatKho: firstItem.ngayLapPhieu,
        tgianGiaoNhan: firstItem.tgianGiaoNhan,
        tenNguoiGiao: firstItem.tenNguoiGiao,
        cmtNguoiGiao: firstItem.cmtNguoiGiao,
        congTyNguoiGiao: firstItem.congTyNguoiGiao,
        diaChiNguoiGiao: firstItem.diaChiNguoiGiao,
        idPhieuKiemNghiem: firstItem.idPhieuKiemNghiem,
        soPhieuKiemNghiem: firstItem.soPhieuKiemNghiem,
        ngayKiemNghiemMau: firstItem.ngayKiemNghiemMau,
        phanLoai: firstItem.phanLoai,
        pthucBanTrucTiep: firstItem.pthucBanTrucTiep,
        idHopDong: firstItem.phanLoai === TRUC_TIEP.HOP_DONG ? firstItem.idHopDong : null,
        soHopDong: firstItem.phanLoai === TRUC_TIEP.HOP_DONG ? firstItem.soHopDong : null,
        ngayKyHopDong: firstItem.phanLoai === TRUC_TIEP.HOP_DONG ? firstItem.ngayKyHopDong : null,
        soLuongHopDong: firstItem.phanLoai == TRUC_TIEP.HOP_DONG ? firstItem.soLuongHopDong : null,
        idBangKeBanLe: firstItem.phanLoai === TRUC_TIEP.BAN_LE ? firstItem.idBangKeBanLe : null,
        soBangKeBanLe: firstItem.phanLoai === TRUC_TIEP.BAN_LE ? firstItem.soBangKeBanLe : null,
        ngayTaoBkeBanLe: firstItem.phanLoai === TRUC_TIEP.BAN_LE ? firstItem.ngayTaoBkeBanLe : null,
        soLuongBkeBanLe: firstItem.phanLoai === TRUC_TIEP.BAN_LE ? firstItem.soLuongBkeBanLe : null,
      });
    }
  }

  rowItem: chiTietBangCanKeHang = new chiTietBangCanKeHang();
  dataEdit: { [key: string]: { edit: boolean; data: chiTietBangCanKeHang } } = {};

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
    this.rowItem = new chiTietBangCanKeHang();
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

  async preview(id) {
    await this.bangCanKeHangBttService.preview({
      tenBaoCao: 'Bảng kê cân hàng bán trực tiếp',
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

  setValidForm() {
    const requiredFields = [
      "namKh",
      "tenDvi",
      "maQhNs",
      "ngayLapBangKe",
      "tenNganLoKho",
      "tenNhaKho",
      "tenDiemKho",
      "tenThuKho",
      "tenNguoiGiao",
      "cmtNguoiGiao",
      "congTyNguoiGiao",
      "diaChiNguoiGiao",
      "tgianGiaoNhan",
      "tenLoaiVthh",
      "tenCloaiVthh",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
