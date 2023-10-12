import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {HttpClient} from '@angular/common/http';
import dayjs from 'dayjs';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {STATUS, TRUC_TIEP} from 'src/app/constants/status';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {
  PhieuKtraCluongBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import {
  BienBanLayMauBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/bien-ban-lay-mau-btt.service';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {
  QuyetDinhNvXuatBttService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service";
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";

@Component({
  selector: 'app-them-phieu-ktra-cluong-btt',
  templateUrl: './them-phieu-ktra-cluong-btt.component.html',
  styleUrls: ['./them-phieu-ktra-cluong-btt.component.scss']
})
export class ThemPhieuKtraCluongBttComponent extends Base2Component implements OnInit {
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
  listHinhThucBaoQuan: any[] = [];
  danhSachQuyetDinh: any[] = [];
  danhSachBbLayMau: any[] = [];
  loadDanhSachKnghiemCluong: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private bienBanLayMauBttService: BienBanLayMauBttService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtraCluongBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      maDvi: [''],
      maQhNs: [''],
      soPhieuKiemNghiem: [''],
      ngayLapPhieu: [''],
      idQdNv: [],
      soQdNv: [''],
      ngayKyQdNv: [''],
      idHopDong: [],
      soHopDong: [''],
      ngayKyHopDong: [''],
      tgianGiaoNhan: [''],
      idBangKeBanLe: [],
      soBangKeBanLe: [''],
      ngayTaoBkeBanLe: [''],
      idBbLayMau: [],
      soBbLayMau: [''],
      ngayLayMau: [''],
      maDiemKho: [''],
      maNhaKho: [''],
      maNganKho: [''],
      maLoKho: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      donViTinh: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      hinhThucBaoQuan: [''],
      ngayKiemNghiemMau: [''],
      idKtvBaoQuan: [],
      idThuKho: [],
      idTphongKtvBaoQuan: [],
      ketQua: [''],
      nhanXet: [''],
      pthucBanTrucTiep: [''],
      phanLoai: [''],
      maDviCon: [''],
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
      tenKtvBaoQuan: [''],
      tenThuKho: [''],
      tenTphongKtvBaoQuan: [''],
      tenTrangThai: [''],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/PKNCL-' + this.userInfo.DON_VI.tenVietTat;
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
      await this.loadDataComboBox();
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    this.maTuSinh = await this.userService.getId('XH_PHIEU_KTRA_CLUONG_BTT_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soPhieuKiemNghiem: `${this.maTuSinh}/${this.formData.get('namKh').value}${this.maHauTo}`,
      ngayLapPhieu: dayjs().format('YYYY-MM-DD'),
      tenKtvBaoQuan: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      phanLoai: TRUC_TIEP.HOP_DONG,
    });
  }

  async onChangeNam(event) {
    if (event) {
      this.formData.patchValue({
        soPhieuKiemNghiem: `${this.maTuSinh}/${event}${this.maHauTo}`,
      });
    }
  }

  async loadDataComboBox() {
    const fetchData = async (fieldName, targetArray, filterCondition) => {
      const res = await this.danhMucService.danhMucChungGetAll(fieldName);
      if (res.msg === MESSAGE.SUCCESS) {
        targetArray.push(...res.data.filter(filterCondition));
      }
    };
    await Promise.all([
      fetchData('HINH_THUC_BAO_QUAN', this.listHinhThucBaoQuan, () => true),
    ]);
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id);
    if (!data) {
      console.error('Không tìm thấy dữ liệu');
      return;
    }
    this.dataTable = data.children;
  }

  async openDialogQdNv() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        namKh: this.formData.value.namKh,
        trangThai: STATUS.BAN_HANH
      }
      const res = await this.quyetDinhNvXuatBttService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.danhSachQuyetDinh = res.data.content.filter(item => item.maDvi === this.userInfo.MA_DVI);
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
          await this.onChangeQdNv(data.id);
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
        idBbLayMau: null,
        soBbLayMau: null,
        ngayLayMau: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        loaiHinhNx: null,
        kieuNhapXuat: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        pthucBanTrucTiep: null,
        phanLoai: null,
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        maDviCon: null,
        tenNganLoKho: null,
      });
      this.dataTable = [];
    }
  }

  async onChangeQdNv(id) {
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
        tgianGiaoNhan: data.tgianGiaoNhan,
      });
      await this.loadDanhSachKiemNghiemCluong(data.soQdNv);
      const resLM = await this.bienBanLayMauBttService.search({
        namKh: data.namKh,
        soQdNv: data.soQdNv,
        loaiVthh: data.loaiVthh
      })
      if (resLM.msg !== MESSAGE.SUCCESS) {
        this.notification.error(MESSAGE.ERROR, resLM.msg);
        return;
      }
      const dataLM = resLM.data.content;
      if (!dataLM || dataLM.length === 0) {
        return;
      }
      this.danhSachBbLayMau = dataLM
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogBbLayMau() {
    const soBbLayMauSet = new Set(this.loadDanhSachKnghiemCluong.map(item => item.soBbLayMau));
    this.danhSachBbLayMau = this.danhSachBbLayMau.filter(item => !soBbLayMauSet.has(item.soBbLayMau));
    const formattedData = this.danhSachBbLayMau.map(item => ({
      ...item,
      soLuongKiemTra: item.soLuongKiemTra.toLocaleString()
    }));
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH BIÊN BẢN LẤY MẪU BÀN GIAO MẪU',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: formattedData,
        dataHeader: ['Số biên bản', 'Ngày lấy mẫu', 'Số lượng lấy mẫu'],
        dataColumn: ['soBbLayMau', 'ngayLayMau', 'soLuongKiemTra'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeBbLayMau(data.id);
      }
    });
  }

  changeBbLayMau(event) {
    if (this.flagInit && event && event !== this.formData.value.soBbLayMau) {
      const phuongThuc = this.formData.get('phanLoai').value;
      if (phuongThuc === TRUC_TIEP.HOP_DONG) {
        this.formData.patchValue({
          idBangKeBanLe: null,
          soBangKeBanLe: null,
          ngayTaoBkeBanLe: null,
        });
      }
      if (phuongThuc === TRUC_TIEP.BAN_LE) {
        this.formData.patchValue({
          idHopDong: null,
          soHopDong: null,
          ngayKyHopDong: null,
        });
      }
      this.dataTable = [];
    }
  }

  async onChangeBbLayMau(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.bienBanLayMauBttService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idBbLayMau: data.id,
        soBbLayMau: data.soBbLayMau,
        ngayLayMau: data.ngayLayMau,
        idHopDong: data.idHopDong,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
        idBangKeBanLe: data.idBangKeBanLe,
        soBangKeBanLe: data.soBangKeBanLe,
        ngayTaoBkeBanLe: data.ngayTaoBkeBanLe,
        loaiHinhNx: data.loaiHinhNx,
        kieuNx: data.kieuNx,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        donViTinh: data.donViTinh,
        pthucBanTrucTiep: data.pthucBanTrucTiep,
        phanLoai: data.phanLoai,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        maDviCon: data.maDvi,
        tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho
      });
      if (this.formData.value.cloaiVthh) {
        await this.loadDsQcTheoCloaiVthh()
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDsQcTheoCloaiVthh() {
    try {
      const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(this.formData.value.cloaiVthh);
      if (res.msg === MESSAGE.SUCCESS) {
        this.dataTable = res.data || [];
        this.dataTable.forEach(element => {
          element.edit = false;
        });
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (err) {
      this.notification.error(MESSAGE.ERROR, err.msg);
    }
  }

  async loadDanhSachKiemNghiemCluong(event) {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.phieuKtraCluongBttService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachKnghiemCluong = data;
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

  async preview(id) {
    await this.phieuKtraCluongBttService.preview({
      tenBaoCao: 'Phiếu kiểm nghiệm chất lượng bán trực tiếp',
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
    const phuongThuc = this.formData.get('phanLoai').value;
    if (phuongThuc === TRUC_TIEP.HOP_DONG) {
      this.formData.get("soHopDong").setValidators([Validators.required]);
      this.formData.get("soHopDong").updateValueAndValidity();
    }
    if (phuongThuc === TRUC_TIEP.BAN_LE) {
      this.formData.get("soBangKeBanLe").setValidators([Validators.required]);
      this.formData.get("soBangKeBanLe").updateValueAndValidity();
    }
    this.formData.get("soQdNv").setValidators([Validators.required]);
    this.formData.get("soBbLayMau").setValidators([Validators.required]);
    this.formData.controls["soPhieuKiemNghiem"].setValidators([Validators.required]);
  }

  setValidForm() {
    const requiredFields = [
      "namKh",
      "tenDvi",
      "maQhNs",
      "ngayLapPhieu",
      "ngayLayMau",
      "tenNganLoKho",
      "tenNhaKho",
      "tenDiemKho",
      "tenLoaiVthh",
      "tenCloaiVthh",
      "hinhThucBaoQuan",
      "ngayKiemNghiemMau",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
