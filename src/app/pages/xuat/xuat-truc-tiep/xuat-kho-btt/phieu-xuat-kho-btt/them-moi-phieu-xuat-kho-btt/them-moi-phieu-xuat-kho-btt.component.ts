import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {Validators} from "@angular/forms";
import {STATUS, THONG_TIN_BAN_TRUC_TIEP, TRUC_TIEP} from "../../../../../../constants/status";
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
  PhieuKtraCluongBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {BangKeBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {FileDinhKem} from "../../../../../../models/FileDinhKem";

@Component({
  selector: 'app-them-moi-phieu-xuat-kho-btt',
  templateUrl: './them-moi-phieu-xuat-kho-btt.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho-btt.component.scss']
})
export class ThemMoiPhieuXuatKhoBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() idQdGnv: number;
  @Input() idKiemnghiem: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  TRUC_TIEP = TRUC_TIEP;
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  danhSachQuyetDinh: any[] = [];
  danhSachKghiemCluong: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private phieuXuatKhoBttService: PhieuXuatKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService,
    private bangKeBttService: BangKeBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      maDvi: [''],
      maQhNs: [''],
      soPhieuXuatKho: [''],
      ngayLapPhieu: [''],
      taiKhoanNo: [],
      taiKhoanCo: [],
      idQdNv: [],
      soQdNv: [''],
      ngayKyQdNv: [''],
      idPhieuKiemNghiem: [],
      soPhieuKiemNghiem: [''],
      ngayKiemNghiemMau: [''],
      maDiemKho: [''],
      maNhaKho: [''],
      maNganKho: [''],
      maLoKho: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      donViTinh: [''],
      idBangKeHang: [],
      soBangKeHang: [''],
      idThuKho: [],
      idKtvBaoQuan: [],
      idLanhDaoChiCuc: [],
      keToanTruong: [''],
      tgianGiaoNhan: [''],
      tenNguoiGiao: [''],
      cmtNguoiGiao: [''],
      congTyNguoiGiao: [''],
      diaChiNguoiGiao: [''],
      idHopDong: [],
      soHopDong: [''],
      ngayKyHopDong: [''],
      soLuongHopDong: [''],
      idBangKeBanLe: [],
      soBangKeBanLe: [''],
      ngayTaoBkeBanLe: [''],
      soLuongBkeBanLe: [''],
      maSo: [''],
      theoChungTu: [],
      thucXuat: [],
      donGia: [],
      thanhTien: [],
      ghiChu: [''],
      pthucBanTrucTiep: [''],
      phanLoai: [''],
      trangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenDiemKho: [''],
      tenNhaKho: [''],
      tenNganKho: [''],
      tenLoKho: [''],
      tenNganLoKho: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenThuKho: [''],
      tenKtvBaoQuan: [''],
      tenLanhDaoChiCuc: [''],
      tenTrangThai: [''],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/PXK-' + this.userInfo.DON_VI.tenVietTat;
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
    this.maTuSinh = await this.userService.getId('XH_PHIEU_XKHO_BTT_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soPhieuXuatKho: `${this.maTuSinh}/${this.formData.get('namKh').value}${this.maHauTo}`,
      ngayLapPhieu: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      phanLoai: TRUC_TIEP.HOP_DONG
    });
    if (this.idQdGnv > 0 && this.idKiemnghiem > 0) {
      await this.onChange(this.idQdGnv);
      await this.onChangeKnghiemCluong(this.idKiemnghiem)
    }
  }

  async onChangeNam(event) {
    if (event) {
      this.formData.patchValue({
        soPhieuXuatKho: `${this.maTuSinh}/${event}${this.maHauTo}`,
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
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
        loaiHinhNx: null,
        tenLoaiHinhNx: null,
        kieuNx: null,
        tenKieuNx: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        idKtvBaoQuan: null,
        tenKtvBaoQuan: null,
        tgianGiaoNhan: null,
        pthucBanTrucTiep: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        theoChungTu: null,
        donGia: null,
        soLuongBkeBanLe: null,
        soLuongHopDong: null,
      });
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
      if (data.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA) {
        data.children.forEach(item => {
          item.children.forEach(child => {
            this.dataTable.push(child)
          })
        })
      }
      const resKn = await this.phieuKtraCluongBttService.search({
        namKh: data.namKh,
        soQdNv: data.soQdNv,
        loaiVthh: data.loaiVthh,
        trangThai: STATUS.DA_DUYET_LDC,
      })
      if (resKn.msg !== MESSAGE.SUCCESS) {
        this.notification.error(MESSAGE.ERROR, resKn.msg);
        return;
      }
      const dataKn = resKn.data.content;
      if (!dataKn || dataKn.length === 0) {
        return;
      }
      this.danhSachKghiemCluong = dataKn
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogKnghiemCluong() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH PHIẾU KIỂM NGHIỆM CHẤT LƯỢNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.danhSachKghiemCluong,
        dataHeader: ['Số phiếu kiểm nghiệm chất lượng', 'Ngày kiểm nghiệm', 'Loại vật tư hàng háo'],
        dataColumn: ['soPhieuKiemNghiem', 'ngayKiemNghiemMau', 'tenLoaiVthh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeKnghiemCluong(data.id);
      }
    });
  }

  changePhieuKiemNghiem(event) {
    if (this.flagInit && event && event !== this.formData.value.soPhieuKiemNghiem) {
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
        loaiHinhNx: null,
        tenLoaiHinhNx: null,
        kieuNx: null,
        tenKieuNx: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        idKtvBaoQuan: null,
        tenKtvBaoQuan: null,
        tgianGiaoNhan: null,
        pthucBanTrucTiep: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        theoChungTu: null,
        donGia: null,
        soLuongBkeBanLe: null,
        soLuongHopDong: null,
      })
    }
  }

  async onChangeKnghiemCluong(id) {
    if (id <= 0) return;
    try {
      const res = await this.phieuKtraCluongBttService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idPhieuKiemNghiem: data.id,
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
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        donViTinh: data.donViTinh,
        idKtvBaoQuan: data.idTphongKtvBaoQuan,
        tenKtvBaoQuan: data.tenTphongKtvBaoQuan,
        tgianGiaoNhan: data.tgianGiaoNhan,
        phanLoai: data.phanLoai,
        pthucBanTrucTiep: data.pthucBanTrucTiep,
        idHopDong: data.phanLoai === TRUC_TIEP.HOP_DONG ? data.idHopDong : null,
        soHopDong: data.phanLoai === TRUC_TIEP.HOP_DONG ? data.soHopDong : null,
        ngayKyHopDong: data.phanLoai === TRUC_TIEP.HOP_DONG ? data.ngayKyHopDong : null,
        idBangKeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.idBangKeBanLe : null,
        soBangKeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.soBangKeBanLe : null,
        ngayTaoBkeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.ngayTaoBkeBanLe : null,
      })
      await this.onchangeSoLuongDonGia(data);
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onchangeSoLuongDonGia(data) {
    if (data.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN) {
      const resHd = await this.hopDongBttService.getDetail(data.idHopDong)
      if (resHd.msg !== MESSAGE.SUCCESS || !resHd.data) {
        return;
      }
      this.dataTable = resHd.data.xhHopDongBttDviList;
    }
    if (data.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.BAN_LE) {
      const resBL = await this.bangKeBttService.getDetail(data.idBangKeBanLe)
      if (resBL.msg !== MESSAGE.SUCCESS || !resBL.data) {
        return;
      }
      this.formData.patchValue({
        theoChungTu: resBL.data.soLuong,
        donGia: resBL.data.donGia,
        soLuongBkeBanLe: resBL.data.soLuong,
      });
    }
    if (this.formData.value.phanLoai === TRUC_TIEP.HOP_DONG) {
      let soLuongDonGia = this.dataTable.find(item =>
        item.maDiemKho == data.maDiemKho &&
        item.maNhaKho == data.maNhaKho &&
        item.maNganKho == data.maNganKho &&
        item.maLoKho == data.maLoKho
      );
      if (soLuongDonGia) {
        this.formData.patchValue({
          theoChungTu: soLuongDonGia.soLuong || soLuongDonGia.soLuongKyHd,
          donGia: soLuongDonGia.donGia || soLuongDonGia.donGiaKyHd,
          soLuongHopDong: soLuongDonGia.soLuong || soLuongDonGia.soLuongKyHd,
        });
      }
    }
  }

  onChangeTien(event) {
    const donGia = this.formData.value.donGia;
    if (event && !isNaN(event) && donGia && !isNaN(donGia)) {
      const thanhTien = event * donGia;
      this.formData.patchValue({
        thanhTien: thanhTien,
      });
    }
  }

  clear() {
    this.formData.patchValue({
      maSo: [''],
      thucXuat: ['']
    });
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["soPhieuXuatKho"].setValidators([Validators.required]);
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
      this.formData.controls["soPhieuKiemNghiem"].setValidators([Validators.required]);
      const body = {...this.formData.value,};
      await this.createUpdate(body);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      const soBangKeHang = this.formData.value.soBangKeHang;
      if (!soBangKeHang) {
        this.notification.error(MESSAGE.WARNING, "Phiếu xuất kho chưa có bảng kê cân hàng");
        return;
      }
      await this.helperService.ignoreRequiredForm(this.formData);
      this.setValidForm();
      const body = {...this.formData.value};
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async preview(id) {
    await this.phieuXuatKhoBttService.preview({
      tenBaoCao: 'Phiếu xuất kho kế hoạch bán trực tiếp',
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
    const phanLoai = this.formData.get('phanLoai').value;
    const requiredFields = [
      "namKh",
      "tenDvi",
      "maQhNs",
      "ngayLapPhieu",
      "tenLoaiHinhNx",
      "tenKieuNx",
      "tenNganLoKho",
      "tenNhaKho",
      "tenDiemKho",
      "tenLoaiVthh",
      "tenCloaiVthh",
      "tenThuKho",
      "tenKtvBaoQuan",
      "keToanTruong",
      "tgianGiaoNhan",
      "soBangKeHang",
      "tenNguoiGiao",
      "cmtNguoiGiao",
      "congTyNguoiGiao",
      "diaChiNguoiGiao",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
    if (phanLoai === TRUC_TIEP.HOP_DONG) {
      this.formData.get("soHopDong").setValidators([Validators.required]);
      this.formData.get("soHopDong").updateValueAndValidity();
    }
    if (phanLoai === TRUC_TIEP.BAN_LE) {
      this.formData.get("soBangKeBanLe").setValidators([Validators.required]);
      this.formData.get("soBangKeBanLe").updateValueAndValidity();
    }
  }
}
