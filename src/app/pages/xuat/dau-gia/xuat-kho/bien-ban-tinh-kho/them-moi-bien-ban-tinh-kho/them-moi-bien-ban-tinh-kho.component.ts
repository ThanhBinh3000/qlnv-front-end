import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
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
import {Validators} from '@angular/forms';
import {
  BienBanTinhKhoService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanTinhKho.service';
import {
  QuyetDinhGiaoNvXuatHangService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {
  PhieuXuatKhoService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service";
import {AMOUNT_ONE_DECIMAL} from "../../../../../../Utility/utils";

@Component({
  selector: 'app-bdg-them-moi-bien-ban-tinh-kho',
  templateUrl: './them-moi-bien-ban-tinh-kho.component.html',
  styleUrls: ['./them-moi-bien-ban-tinh-kho.component.scss']
})
export class ThemMoiBienBanTinhKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};
  templateNameVt = "Biên bản tịnh kho bán đấu giá vật tư";
  templateNameLt = "Biên bản tịnh kho bán đấu giá lương thực";
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  dataQuyetDinh: any[] = [];
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
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
    private phieuXuatKhoService: PhieuXuatKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year'), [Validators.required]],
        maDvi: [''],
        maQhNs: [''],
        soBbTinhKho: [''],
        ngayLapBienBan: [''],
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
        loaiVthh: [''],
        cloaiVthh: [''],
        tenHangHoa: [''],
        donViTinh: [''],
        hinhThucBaoQuan: [''],
        ngayBatDauXuat: [''],
        ngayKetThucXuat: [''],
        tongSlNhap: [],
        tongSlXuat: [],
        slConLai: [],
        slThucTe: [],
        slThua: [],
        slThieu: [],
        nguyenNhan: [''],
        kienNghi: [''],
        ghiChu: [''],
        idThuKho: [],
        idKtvBaoQuan: [],
        idKeToan: [],
        idLanhDaoChiCuc: [],
        loaiHinhNx: [''],
        kieuNhapXuat: [''],
        thoiGianGiaoNhan: [''],
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
        tenHinhThucBaoQuan: [''],
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
      this.maHauTo = '-BBTK';
      this.amount.align = "left";
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
    this.maTuSinh = await this.userService.getId('XH_DG_BB_TINH_KHO_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBbTinhKho: `${this.maTuSinh}/${this.formData.get('nam').value}${this.maHauTo}`,
      ngayLapBienBan: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
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
        tenLoKho: null,
        tenNganLoKho: null,
        loaiHinhKho: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        hinhThucBaoQuan: null,
        tenHinhThucBaoQuan: null,
        ngayBatDauXuat: null,
        tongSlNhap: null,
        tongSlXuat: null,
        slConLai: null,
        slThucTe: null,
        slThua: null,
        slThieu: null,
        thoiGianGiaoNhan: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
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
        loaiHinhNx: data.loaiHinhNx,
        kieuNhapXuat: data.kieuNhapXuat,
      });
      await this.loadDanhSachTinhKho(data.soQdNv)
      const dataChiCuc = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
      if (dataChiCuc && dataChiCuc.children && dataChiCuc.children.length > 0) {
        const idKhoSet = new Set(this.listDanhSachTinhKho.map(item => item.idKho));
        this.listDiaDiemXuat = dataChiCuc.children.filter(item => !idKhoSet.has(item.id))
      }
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
    const res = await this.bienBanTinhKhoService.search(body)
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
          tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
          tongSlNhap: data.tonKho || 0,
        });
        await this.loadDanhSachPhieuXuatKho();
      }
    });
  }

  async changeKho(event) {
    if (this.flagInit && event && event !== this.formData.value.maLoKho && this.formData.value.maNganKho) {
      this.formData.patchValue({
        loaiHinhKho: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        hinhThucBaoQuan: null,
        tenHinhThucBaoQuan: null,
        ngayBatDauXuat: null,
        tongSlNhap: null,
        tongSlXuat: null,
        slConLai: null,
        slThucTe: null,
        slThua: null,
        slThieu: null,
        thoiGianGiaoNhan: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
      })
      this.dataTable = [];
    }
  }

  async loadDanhSachPhieuXuatKho() {
    let body = {
      loaiVthh: this.loaiVthh,
      nam: this.formData.value.nam,
      trangThai: STATUS.DA_DUYET_LDCC,
      soQdNv: this.formData.value.soQdNv,
    }
    const res = await this.phieuXuatKhoService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    const filterConditions = data.filter(item => item.idKho === this.formData.value.idKho && item.idQdNv === this.formData.value.idQdNv);
    if (filterConditions.length > 0) {
      const tongSlXuat = filterConditions.reduce((prev, cur) => prev + cur.thucXuat, 0);
      this.formData.patchValue({
        idQdNvDtl: filterConditions[0].idQdNvDtl,
        idPhieuKiemNghiem: filterConditions[0].idPhieuKiemNghiem,
        soPhieuKiemNghiem: filterConditions[0].soPhieuKiemNghiem,
        ngayKiemNghiemMau: filterConditions[0].ngayKiemNghiemMau,
        thoiGianGiaoNhan: filterConditions[0].thoiGianGiaoNhan,
        loaiVthh: filterConditions[0].loaiVthh,
        tenLoaiVthh: filterConditions[0].tenLoaiVthh,
        cloaiVthh: filterConditions[0].cloaiVthh,
        tenCloaiVthh: filterConditions[0].tenCloaiVthh,
        tenHangHoa: filterConditions[0].tenHangHoa,
        donViTinh: filterConditions[0].donViTinh,
        loaiHinhKho: filterConditions[0].loaiHinhKho,
        hinhThucBaoQuan: filterConditions[0].hinhThucBaoQuan,
        tenHinhThucBaoQuan: filterConditions[0].tenHinhThucBaoQuan,
        ngayBatDauXuat: filterConditions[0].ngayLapPhieu,
        ngayKetThucXuat: this.formData.value.ngayLapBienBan,
        tongSlXuat: tongSlXuat,
        slConLai: this.formData.value.tongSlNhap - tongSlXuat
      });
      this.dataTable = filterConditions.map(item => ({
        idPhieuXuatKho: item.id,
        soPhieuXuatKho: item.soPhieuXuatKho,
        ngayXuatKho: item.ngayLapPhieu,
        idBangKeHang: item.idBangKeHang,
        soBangKeHang: item.soBangKeHang,
        soLuongXuat: item.thucXuat,
      }));
    }
  }

  async onNgayLapBb(event) {
    if (event) {
      this.formData.patchValue({
        ngayKetThucXuat: event,
      });
    }
  }

  async onChangeSlChenhLech(event) {
    const slConLai = this.formData.value.slConLai || 0;
    const slChenhLech = event - slConLai
    this.formData.patchValue({
      slThua: slChenhLech >= 0 ? slChenhLech : 0,
      slThieu: slChenhLech <= 0 ? slChenhLech * (-1) : 0
    });
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

  async saveAndApproveAndReject(action: string, trangThai?: string, msg?: string, msgSuccess?: string) {
    try {
      if (this.checkPrice && this.checkPrice.boolean) {
        this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
        return;
      }
      if (this.checkPrice && this.checkPrice.booleanNhapXuat) {
        this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
        return;
      }
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = {
        ...this.formData.value,
        children: this.dataTable,
      };
      switch (action) {
        case "createUpdate":
          this.formData.controls["soQdNv"].setValidators([Validators.required]);
          await this.createUpdate(body);
          break;
        case "saveAndSend":
          this.setValidForm();
          await this.saveAndSend(body, trangThai, msg, msgSuccess);
          break;
        case "approve":
          await this.approve(this.idInput, trangThai, msg);
          break;
        case "reject":
          await this.reject(this.idInput, trangThai);
          break;
        default:
          console.error("Invalid action: ", action);
          break;
      }
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  setValidForm() {
    const requiredFields = [
      "ngayLapBienBan",
      "soQdNv",
      "tenNganLoKho",
      "slThucTe",
      "nguyenNhan",
      "kienNghi",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
