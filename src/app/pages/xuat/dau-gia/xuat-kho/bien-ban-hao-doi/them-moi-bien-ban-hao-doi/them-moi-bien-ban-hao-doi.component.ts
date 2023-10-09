import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {Validators} from '@angular/forms';
import {
  QuyetDinhGiaoNvXuatHangService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {
  BienBanHaoDoiService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanHaoDoi.service";
import {
  BienBanTinhKhoService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanTinhKho.service";
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";

@Component({
  selector: 'app-bdg-them-moi-bien-ban-hao-doi',
  templateUrl: './them-moi-bien-ban-hao-doi.component.html',
  styleUrls: ['./them-moi-bien-ban-hao-doi.component.scss']
})
export class ThemMoiBienBanHaoDoiComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  dataQuyetDinh: any[] = [];
  listDanhSachHaoDoi: any[] = [];
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
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
    private bienBanHaoDoiService: BienBanHaoDoiService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year'), [Validators.required]],
        maDvi: [''],
        maQhNs: [''],
        soBbHaoDoi: [''],
        ngayLapBienBan: [''],
        idQdNv: [],
        soQdNv: [''],
        ngayKyQdNv: [''],
        idHopDong: [],
        soHopDong: [''],
        ngayKyHopDong: [''],
        idBbTinhKho: [],
        soBbTinhKho: [''],
        ngayLapBbTinhKho: [''],
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
        idThuKho: [],
        idKtvBaoQuan: [],
        idKeToan: [],
        idLanhDaoChiCuc: [],
        tongSlNhap: [],
        thoiGianKthucNhap: [''],
        tongSlXuat: [''],
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
        idPhieuKiemNghiem: [],
        soPhieuKiemNghiem: [''],
        ngayKiemNghiemMau: [''],
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
      }
    );
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
    this.maTuSinh = await this.userService.getId('XH_DG_BB_HAO_DOI_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBbHaoDoi: `${this.maTuSinh}/${this.formData.get('nam').value}${this.maHauTo}`,
      ngayLapBienBan: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
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
    this.dataTable = data.children
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

  changeSoQdNv(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdNv) {
      this.formData.patchValue({
        idBbTinhKho: null,
        soBbTinhKho: null,
        ngayLapBbTinhKho: null,
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
        loaiHinhhKho: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        ngayBatDauXuat: null,
        ngayKetThucXuat: null,
        tongSlNhap: null,
        tongSlXuat: null,
        thoiGianKthucXuat: null,
        slHaoThucTe: null,
        tileHaoThucTe: null,
      })
      this.dataTable = [];
    }
  }

  async onChange(id) {
    if (id <= 0) return;
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
      });
      await this.loadDanhSachHaoDoi(data.soQdNv)
      const resTK = await this.bienBanTinhKhoService.search({
        nam: data.nam,
        soQdNv: data.soQdNv,
        loaiVthh: data.loaiVthh,
        trangThai: STATUS.DA_DUYET_LDCC,
      })
      if (resTK.msg !== MESSAGE.SUCCESS) {
        this.notification.error(MESSAGE.ERROR, resTK.msg);
        return;
      }
      const dataTK = resTK.data.content;
      if (!dataTK || dataTK.length === 0) {
        return;
      }
      const setSoBbTinhKho = new Set(this.listDanhSachHaoDoi.map(item => item.soBbTinhKho));
      this.danhSachTinhKho = dataTK.filter(item => !setSoBbTinhKho.has(item.soBbTinhKho))
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDanhSachHaoDoi(event) {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.bienBanHaoDoiService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.listDanhSachHaoDoi = data;
  }

  openDialogTinhKho() {
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
  }

  async onChangeBienBanTinhKho(id) {
    if (id <= 0) return;
    try {
      const res = await this.bienBanTinhKhoService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      const tongSlNhap = data.tongSlNhap || 0;
      const tongSlXuat = data.tongSlXuat || 0;
      const slHaoThucTe = tongSlNhap - tongSlXuat;
      const tileHaoThucTe = (slHaoThucTe / tongSlNhap) * 100;
      this.formData.patchValue({
        idBbTinhKho: data.id,
        soBbTinhKho: data.soBbTinhKho,
        ngayLapBbTinhKho: data.ngayLapBienBan,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        diaDiemKho: data.diaDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
        loaiHinhhKho: data.loaiHinhhKho,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        donViTinh: data.donViTinh,
        ngayBatDauXuat: data.ngayBatDauXuat,
        ngayKetThucXuat: data.ngayKetThucXuat,
        idPhieuKiemNghiem: data.idPhieuKiemNghiem,
        soPhieuKiemNghiem: data.soPhieuKiemNghiem,
        ngayKiemNghiemMau: data.ngayKiemNghiemMau,
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
      "nam",
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
    await this.bienBanHaoDoiService.preview({
      tenBaoCao: 'Biên bản hao đôi bán đấu giá',
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
