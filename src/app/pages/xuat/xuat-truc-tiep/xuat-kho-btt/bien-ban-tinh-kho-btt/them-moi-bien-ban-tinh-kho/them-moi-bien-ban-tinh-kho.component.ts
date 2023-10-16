import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS, TRUC_TIEP} from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Validators} from "@angular/forms";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {
  BienBanTinhKhoBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-tinh-kho-btt.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {QuanLyHangTrongKhoService} from "../../../../../../services/quanLyHangTrongKho.service";
import {
  BangCanKeHangBttService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bang-can-ke-hang-btt.service";
import {
  PhieuKtraCluongBttService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";

@Component({
  selector: 'app-them-moi-bien-ban-tinh-kho',
  templateUrl: './them-moi-bien-ban-tinh-kho.component.html',
  styleUrls: ['./them-moi-bien-ban-tinh-kho.component.scss']
})
export class ThemMoiBienBanTinhKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  TRUC_TIEP = TRUC_TIEP;
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  danhSachQuyetDinh: any[] = [];
  listDiaDiemXuat: any[] = [];
  listDanhSachTinhKho: any[] = [];
  idXuatKho: number = 0;
  isViewXuatKho: boolean = false;
  idBangKe: number = 0;
  isViewBangKe: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private bienBanTinhKhoBttService: BienBanTinhKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private bangCanKeHangBttService: BangCanKeHangBttService,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoBttService);
    this.formData = this.fb.group({
      id: [''],
      namKh: [dayjs().get('year'), [Validators.required]],
      maDvi: [''],
      maQhNs: [''],
      soBbTinhKho: [''],
      ngayLapBienBan: [''],
      idQdNv: [''],
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
      ngayBatDauXuat: [''],
      ngayKetThucXuat: [''],
      idPhieuKiemNghiem: [''],
      soPhieuKiemNghiem: [''],
      ngayKiemNghiemMau: [''],
      idHopDong: [''],
      soHopDong: [''],
      ngayKyHopDong: [''],
      soLuongHopDong: [''],
      idBangKeBanLe: [''],
      soBangKeBanLe: [''],
      ngayTaoBkeBanLe: [''],
      soLuongBkeBanLe: [''],
      tongSlNhap: [''],
      tongSlXuat: [''],
      slConLai: [''],
      slThucTe: [''],
      slThua: [''],
      slThieu: [''],
      nguyenNhan: [''],
      kienNghi: [''],
      ghiChu: [''],
      idThuKho: [''],
      idKtvBaoQuan: [''],
      idKeToan: [''],
      idLanhDaoChiCuc: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      pthucBanTrucTiep: [''],
      phanLoai: [''],
      tgianGiaoNhan: [''],
      trangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenDiemKho: [''],
      tenNhaKho: [''],
      tenNganKho: [''],
      tenLoKho: [''],
      tenNganLoKho: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenThuKho: [''],
      tenKtvBaoQuan: [''],
      tenKeToan: [''],
      tenLanhDaoChiCuc: [''],
      tenTrangThai: [''],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '-BBTK';
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    this.maTuSinh = await this.userService.getId('XH_BB_TINHK_BTT_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBbTinhKho: `${this.maTuSinh}/${this.formData.get('namKh').value}${this.maHauTo}`,
      ngayLapBienBan: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      phanLoai: TRUC_TIEP.HOP_DONG
    })
  }

  async onChangeNam(event) {
    if (event) {
      this.formData.patchValue({
        soBbTinhKho: `${this.maTuSinh}/${event}${this.maHauTo}`,
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
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        ngayBatDauXuat: null,
        tongSlXuat: null,
        phanLoai: null,
        pthucBanTrucTiep: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        soLuongHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        soLuongBkeBanLe: null,
        tongSlNhap: null,
        slConLai: null,
        slThua: null,
        slThieu: null,
        slThucTe: null,
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
      await this.loadDanhSachTinhKho(data.soQdNv)
      const dataChiCuc = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
      this.listDiaDiemXuat = dataChiCuc?.children
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDanhSachTinhKho(event) {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.bienBanTinhKhoBttService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.listDanhSachTinhKho = data;
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
        await this.loadDanhSachBangKeCanHang(data);
      }
    });
  }

  changeKho(event) {
    if (this.flagInit && event && event !== this.formData.value.maLoKho && this.formData.value.maNganKho) {
      this.formData.patchValue({
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        ngayBatDauXuat: null,
        tongSlXuat: null,
        phanLoai: null,
        pthucBanTrucTiep: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        soLuongHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        soLuongBkeBanLe: null,
        tongSlNhap: null,
        slConLai: null,
        slThua: null,
        slThieu: null,
        slThucTe: null,
      })
      this.dataTable = [];
    }
  }

  async loadDanhSachBangKeCanHang(kho) {
    const {maDiemKho, maNhaKho, maNganKho, maLoKho} = kho;
    let body = {
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namKh,
      trangThai: STATUS.DA_DUYET_LDCC,
      soQdNv: this.formData.value.soQdNv,
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
    const filterConditions = data.filter(item =>
      item.maDiemKho === maDiemKho &&
      item.maNhaKho === maNhaKho &&
      item.maNganKho === maNganKho &&
      item.maLoKho === maLoKho
    );
    if (filterConditions.length > 0) {
      this.dataTable = filterConditions.map(item => ({
        idPhieuXuatKho: item.idPhieuXuatKho,
        soPhieuXuatKho: item.soPhieuXuatKho,
        ngayXuatKho: item.ngayXuatKho,
        idBangKeHang: item.id,
        soBangKeHang: item.soBangKeHang,
        soLuongXuat: item.tongTrongLuongCaBi,
      }));
      await this.loadPhieuKiemNghiem(filterConditions);
    }
  }

  async loadPhieuKiemNghiem(filterConditions) {
    const first = filterConditions[0]
    if (first.idPhieuKiemNghiem <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.phieuKtraCluongBttService.getDetail(first.idPhieuKiemNghiem);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idPhieuKiemNghiem: data.id,
        soPhieuKiemNghiem: data.soPhieuKiemNghiem,
        ngayKiemNghiemMau: data.ngayKiemNghiemMau,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        donViTinh: data.donViTinh,
        ngayBatDauXuat: first.ngayXuatKho,
        ngayKetThucXuat: this.formData.value.ngayLapBienBan,
        tongSlXuat: this.dataTable.reduce((total, child) => total + child.soLuongXuat, 0),
        tgianGiaoNhan: data.tgianGiaoNhan,
        loaiHinhNx: data.loaiHinhNx,
        kieuNx: data.kieuNx,
        phanLoai: data.phanLoai,
        pthucBanTrucTiep: data.pthucBanTrucTiep,
        idHopDong: data.phanLoai === TRUC_TIEP.HOP_DONG ? data.idHopDong : null,
        soHopDong: data.phanLoai === TRUC_TIEP.HOP_DONG ? data.soHopDong : null,
        ngayKyHopDong: data.phanLoai === TRUC_TIEP.HOP_DONG ? data.ngayKyHopDong : null,
        soLuongHopDong: data.phanLoai == TRUC_TIEP.HOP_DONG ? data.soLuongHopDong : null,
        idBangKeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.idBangKeBanLe : null,
        soBangKeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.soBangKeBanLe : null,
        ngayTaoBkeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.ngayTaoBkeBanLe : null,
        soLuongBkeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.soLuongBkeBanLe : null,
      });
      await this.tonKho();
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onNgayLapBb(event) {
    if (event) {
      this.formData.patchValue({
        ngayKetThucXuat: event,
      });
    }
  }

  async tonKho() {
    const maDvi = this.formData.value.maLoKho ? this.formData.value.maLoKho : this.formData.value.maNganKho
    const loaiVthh = this.formData.value.loaiVthh
    const cloaiVthh = this.formData.value.cloaiVthh
    const body = {
      maDvi: maDvi,
      loaiVthh: this.loaiVthh === LOAI_HANG_DTQG.MUOI ? cloaiVthh : loaiVthh,
      ...(this.loaiVthh === LOAI_HANG_DTQG.MUOI ? {} : {cloaiVthh: cloaiVthh}),
    };
    try {
      const res = await this.quanLyHangTrongKhoService.getTrangThaiHt(body);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const tongSlNhap = res.data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
      const tongSlXuat = this.formData.value.tongSlXuat || 0;
      this.formData.patchValue({
        tongSlNhap: tongSlNhap,
        slConLai: tongSlNhap - tongSlXuat
      });
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeSlChenhLech(event) {
    if (!event) return;
    const slConLai = this.formData.value.slConLai || 0;
    const slChenhLech = event - slConLai
    this.formData.patchValue({
      slThua: slChenhLech > 0 ? slChenhLech : null,
      slThieu: slChenhLech < 0 ? slChenhLech : null
    });
  }

  openModal(id: number, modalType: string) {
    if (modalType === 'xuatKho') {
      this.idXuatKho = id;
      this.isViewXuatKho = true;
    } else if (modalType === 'bangKe') {
      this.idBangKe = id;
      this.isViewBangKe = true;
    }
  }

  closeModal(modalType: string) {
    if (modalType === 'xuatKho') {
      this.idXuatKho = null;
      this.isViewXuatKho = false;
    } else if (modalType === 'bangKe') {
      this.idBangKe = null;
      this.isViewBangKe = false;
    }
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.setValidator();
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

  calcTong(column) {
    if (!this.dataTable) return 0;
    return this.dataTable.reduce((sum, cur) => sum + (cur[column] || 0), 0);
  }

  async preview(id) {
    await this.bienBanTinhKhoBttService.preview({
      tenBaoCao: 'Biên bản tịnh kho bán trực tiếp',
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

  setValidator() {
    const requiredFields = [
      "soBbTinhKho",
      "soQdNv",
      "tenDiemKho",
      "tenNhaKho",
      "tenNganLoKho",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }

  setValidForm() {
    const requiredFields = [
      "namKh",
      "tenDvi",
      "maQhNs",
      "ngayLapBienBan",
      "tenLoaiVthh",
      "tenCloaiVthh",
      "donViTinh",
      "ngayBatDauXuat",
      "ngayKetThucXuat",
      "nguyenNhan",
      "kienNghi",
      "ghiChu",
      "tenThuKho",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
