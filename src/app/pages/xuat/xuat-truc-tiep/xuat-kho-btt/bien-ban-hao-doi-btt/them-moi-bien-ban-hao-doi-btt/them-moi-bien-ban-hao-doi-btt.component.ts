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
import {Base2Component} from 'src/app/components/base2/base2.component';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {Validators} from "@angular/forms";
import {
  BienBanTinhKhoBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-tinh-kho-btt.service';
import {
  BienBanHaoDoiBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-hao-doi-btt.service';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";

@Component({
  selector: 'app-them-moi-bien-ban-hao-doi-btt',
  templateUrl: './them-moi-bien-ban-hao-doi-btt.component.html',
  styleUrls: ['./them-moi-bien-ban-hao-doi-btt.component.scss']
})
export class ThemMoiBienBanHaoDoiBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  TRUC_TIEP = TRUC_TIEP;
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  danhSachQuyetDinh: any[] = [];
  danhSachHaoDoi: any[] = [];
  danhSachTinhKho: any[] = [];
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
    private bienBanTinhKhoBttService: BienBanTinhKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private bienBanHaoDoiBttService: BienBanHaoDoiBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      maDvi: [''],
      maQhNs: [''],
      soBbHaoDoi: [''],
      ngayLapBienBan: [''],
      idQdNv: [],
      soQdNv: [''],
      ngayKyQdNv: [''],
      idQdNvDtl: [],
      idBbTinhKho: [],
      soBbTinhKho: [''],
      ngayLapBbTinhKho: [''],
      idPhieuKiemNghiem: [],
      soPhieuKiemNghiem: [''],
      ngayKiemNghiemMau: [''],
      idKho: [],
      maDiemKho: [''],
      maNhaKho: [''],
      maNganKho: [''],
      maLoKho: [''],
      loaiHinhhKho: [''],
      loaiHinhKho: [''],
      tgianGiaoNhan: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      donViTinh: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      ngayBatDauXuat: [''],
      ngayKetThucXuat: [''],
      idHopDong: [],
      soHopDong: [''],
      ngayKyHopDong: [''],
      soLuongHopDong: [''],
      idBangKeBanLe: [],
      soBangKeBanLe: [''],
      ngayTaoBkeBanLe: [''],
      soLuongBkeBanLe: [''],
      tongSlNhap: [],
      thoiGianKthucNhap: [''],
      tongSlXuat: [],
      thoiGianKthucXuat: [''],
      slHaoThucTe: [],
      tileHaoThucTe: [],
      slHaoVuotMuc: [],
      tileHaoVuotMuc: [],
      slHaoThanhLy: [],
      tileHaoThanhLy: [],
      slHaoDuoiMuc: [],
      tileHaoDuoiMuc: [],
      dinhMucHaoHut: [],
      slHaoTheoDinhMuc: [],
      nguyenNhan: [''],
      kienNghi: [''],
      ghiChu: [''],
      idThuKho: [],
      idKtvBaoQuan: [],
      idKeToan: [],
      idLanhDaoChiCuc: [],
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
      this.maHauTo = '-BBHD';
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
    this.maTuSinh = await this.userService.getId('XH_BB_HDOI_BTT_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBbHaoDoi: `${this.maTuSinh}/${this.formData.get('namKh').value}${this.maHauTo}`,
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
        soBbHaoDoi: `${this.maTuSinh}/${event}${this.maHauTo}`,
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
        namKh: this.formData.value.namKh,
        trangThai: STATUS.BAN_HANH
      }
      const res = await this.quyetDinhNvXuatBttService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.danhSachQuyetDinh = res.data.content.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
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
        idQdNvDtl: null,
        idBbTinhKho: null,
        soBbTinhKho: null,
        ngayLapBbTinhKho: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        idKho: null,
        maDiemKho: null,
        maNhaKho: null,
        maNganKho: null,
        maLoKho: null,
        loaiHinhKho: null,
        tgianGiaoNhan: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        loaiHinhNx: null,
        kieuNx: null,
        ngayBatDauXuat: null,
        ngayKetThucXuat: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        soLuongHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        soLuongBkeBanLe: null,
        tongSlNhap: null,
        thoiGianKthucNhap: null,
        tongSlXuat: null,
        thoiGianKthucXuat: null,
        slHaoThucTe: null,
        tileHaoThucTe: null,
        slHaoVuotMuc: null,
        tileHaoVuotMuc: null,
        slHaoThanhLy: null,
        tileHaoThanhLy: null,
        slHaoDuoiMuc: null,
        tileHaoDuoiMuc: null,
        dinhMucHaoHut: null,
        slHaoTheoDinhMuc: null,
      })
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
        ngayKyQdNv: data.ngayKy,
        loaiVthh: data.loaiVthh,
      });
      await this.loadDanhSachHaoDoi(data.soQdNv)
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDanhSachHaoDoi(event) {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.bienBanHaoDoiBttService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.danhSachHaoDoi = data;
  }

  async openDialogTinhKho() {
    try {
      await this.spinner.show();
      let body = {
        namKh: this.formData.value.namKh,
        soQdNv: this.formData.value.soQdNv,
        loaiVthh: this.formData.value.loaiVthh,
        trangThai: STATUS.DA_DUYET_LDCC,
      }
      const res = await this.bienBanTinhKhoBttService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        const tinhKhoSet = new Set(this.danhSachHaoDoi.map(item => item.soBbTinhKho));
        this.danhSachTinhKho = res.data.content.filter(item => !tinhKhoSet.has(item.soBbTinhKho))
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH BIÊN BẢN TỊNH KHO',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.danhSachTinhKho.filter(item => item.maDvi === this.userInfo.MA_DVI),
          dataHeader: ['Số biên bản tịnh kho', 'Ngày lập biên bản', 'Loại vật tư hàng háo'],
          dataColumn: ['soBbTinhKho', 'ngayLapBienBan', 'tenLoaiVthh'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeBienBanTinhKho(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async changeBbTinhKho(event) {
    if (this.flagInit && event && event !== this.formData.value.soBbTinhKho) {
      this.formData.patchValue({
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        idKho: null,
        maDiemKho: null,
        maNhaKho: null,
        maNganKho: null,
        maLoKho: null,
        loaiHinhKho: null,
        tgianGiaoNhan: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        loaiHinhNx: null,
        kieuNx: null,
        ngayBatDauXuat: null,
        ngayKetThucXuat: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        soLuongHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        soLuongBkeBanLe: null,
        tongSlNhap: null,
        thoiGianKthucNhap: null,
        tongSlXuat: null,
        thoiGianKthucXuat: null,
        slHaoThucTe: null,
        tileHaoThucTe: null,
        slHaoVuotMuc: null,
        tileHaoVuotMuc: null,
        slHaoThanhLy: null,
        tileHaoThanhLy: null,
        slHaoDuoiMuc: null,
        tileHaoDuoiMuc: null,
        dinhMucHaoHut: null,
        slHaoTheoDinhMuc: null,
      })
      this.dataTable = [];
    }
  }

  async onChangeBienBanTinhKho(id) {
    if (id <= 0) return;
    try {
      const res = await this.bienBanTinhKhoBttService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      const tongSlNhap = data.tongSlNhap || 0;
      const tongSlXuat = data.tongSlXuat || 0;
      const slHaoThucTe = tongSlNhap - tongSlXuat;
      const tileHaoThucTe = (slHaoThucTe / tongSlNhap) * 100;
      this.formData.patchValue({
        idKho: data.idKho,
        idQdNvDtl: data.idQdNvDtl,
        idBbTinhKho: data.id,
        soBbTinhKho: data.soBbTinhKho,
        ngayLapBbTinhKho: data.ngayLapBienBan,
        idPhieuKiemNghiem: data.idPhieuKiemNghiem,
        soPhieuKiemNghiem: data.soPhieuKiemNghiem,
        ngayKiemNghiemMau: data.ngayKiemNghiemMau,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
        loaiHinhhKho: data.loaiHinhhKho,
        tgianGiaoNhan: data.tgianGiaoNhan,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        donViTinh: data.donViTinh,
        loaiHinhNx: data.loaiHinhNx,
        kieuNx: data.kieuNx,
        ngayBatDauXuat: data.ngayBatDauXuat,
        ngayKetThucXuat: data.ngayKetThucXuat,
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
        tongSlNhap: tongSlNhap,
        tongSlXuat: tongSlXuat,
        thoiGianKthucXuat: data.ngayKetThucXuat,
        slHaoThucTe: slHaoThucTe,
        tileHaoThucTe: tileHaoThucTe
      })
      this.dataTable = data.children
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  calcTong(column) {
    if (!this.dataTable) return 0;
    return this.dataTable.reduce((sum, cur) => sum + (cur[column] || 0), 0);
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
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
      this.formData.controls["soBbTinhKho"].setValidators([Validators.required]);
      this.formData.controls["soBbHaoDoi"].setValidators([Validators.required]);
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
      "namKh",
      "tenDvi",
      "maQhNs",
      "ngayLapBienBan",
      "soHopDong",
      "ngayKyHopDong",
      "ngayLapBbTinhKho",
      "tenNganLoKho",
      "tenNhaKho",
      "tenDiemKho",
      "ngayBatDauXuat",
      "ngayKetThucXuat",
      "tenThuKho",
      "nguyenNhan",
      "kienNghi",
      "ghiChu",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }

  async preview(id) {
    await this.bienBanHaoDoiBttService.preview({
      tenBaoCao: 'Biên bản hao đôi bán trực tiếp',
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
