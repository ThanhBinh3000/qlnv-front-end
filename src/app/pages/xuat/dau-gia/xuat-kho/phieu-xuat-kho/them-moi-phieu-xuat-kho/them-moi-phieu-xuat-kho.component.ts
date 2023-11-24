import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
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
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {Validators} from '@angular/forms';
import {
  QuyetDinhGiaoNvXuatHangService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {
  XhPhieuKnghiemCluongService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/xhPhieuKnghiemCluong.service';
import {
  PhieuXuatKhoService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {
  BbNghiemThuBaoQuanService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import {AMOUNT_ONE_DECIMAL} from "../../../../../../Utility/utils";

@Component({
  selector: 'app-bdg-them-moi-phieu-xuat-kho',
  templateUrl: './them-moi-phieu-xuat-kho.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho.component.scss']
})
export class ThemMoiPhieuXuatKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() idQdGnv: number;
  @Input() idKiemnghiem: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};
  amount1 = {...AMOUNT_ONE_DECIMAL};
  templateNameVt = "Phiếu xuất kho bán đấu giá vật tư";
  templateNameLt = "Phiếu xuất kho bán đấu giá lương thực";
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  isViewBangKe: boolean = false
  dataQuyetDinh: any[] = [];
  danhSachKghiemCluong: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private xhPhieuKnghiemCluongService: XhPhieuKnghiemCluongService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService,
    private phieuXuatKhoService: PhieuXuatKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year'), [Validators.required]],
        maDvi: [''],
        maQhNs: [''],
        soPhieuXuatKho: [''],
        ngayLapPhieu: [''],
        taiKhoanNo: [],
        taiKhoanCo: [],
        idQdNv: [],
        soQdNv: [''],
        ngayKyQdNv: [''],
        idQdNvDtl: [],
        loaiHinhNx: [''],
        kieuNhapXuat: [''],
        idHopDong: [],
        soHopDong: [''],
        ngayKyHopDong: [''],
        toChucCaNhan: [''],
        idPhieuKiemNghiem: [],
        soPhieuKiemNghiem: [''],
        ngayKiemNghiemMau: [''],
        idKho: [],
        maDiemKho: [''],
        diaDiemKho: [''],
        maNhaKho: [''],
        maNganKho: [''],
        maLoKho: [''],
        loaiHinhKho: [''],
        hinhThucBaoQuan: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        tenHangHoa: [''],
        donViTinh: [''],
        idThuKho: [],
        idKtvBaoQuan: [],
        idLanhDaoChiCuc: [],
        keToanTruong: [''],
        thoiGianGiaoNhan: [''],
        idBangKeHang: [],
        soBangKeHang: [''],
        tenNguoiGiao: [''],
        cmtNguoiGiao: [''],
        congTyNguoiGiao: [''],
        diaChiNguoiGiao: [''],
        maSo: [''],
        theoChungTu: [],
        thucXuat: [],
        donGia: [],
        thanhTien: [],
        ghiChu: [''],
        trangThai: [''],
        lyDoTuChoi: [''],
        tenDvi: [''],
        tenLoaiHinhNx: [''],
        tenKieuNhapXuat: [''],
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
      }
    );
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/PXK-' + this.userInfo.DON_VI.tenVietTat;
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
    this.maTuSinh = await this.userService.getId('XH_DG_PHIEU_XUAT_KHO_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soPhieuXuatKho: `${this.maTuSinh}/${this.formData.get('nam').value}${this.maHauTo}`,
      ngayLapPhieu: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
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
    this.maTuSinh = this.idInput;
    if (data.soBangKeHang) {
      this.isViewBangKe = true;
    }
    if (!this.isView && !this.isViewBangKe) {
      await this.onChange(data.idQdNv);
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
        loaiHinhNx: null,
        tenLoaiHinhNx: null,
        kieuNhapXuat: null,
        tenKieuNhapXuat: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        toChucCaNhan: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        idKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
        hinhThucBaoQuan: null,
        loaiHinhKho: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        idKtvBaoQuan: null,
        tenKtvBaoQuan: null,
        thoiGianGiaoNhan: null,
        donViTinh: null,
        theoChungTu: null,
        donGia: null,
      });
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
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNhapXuat: data.kieuNhapXuat,
        tenKieuNhapXuat: data.tenKieuNhapXuat,
        idHopDong: data.idHopDong,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
        toChucCaNhan: data.toChucCaNhan,
      });
      data.children.forEach(item => {
        item.children.forEach(child => {
          this.dataTable.push(child);
        });
      });
      const resKN = await this.xhPhieuKnghiemCluongService.search({
        nam: data.nam,
        soQdNv: data.soQdNv,
        loaiVthh: data.loaiVthh,
        trangThai: STATUS.DA_DUYET_LDC,
      })
      if (resKN.msg !== MESSAGE.SUCCESS) {
        this.notification.error(MESSAGE.ERROR, resKN.msg);
        return;
      }
      const dataKN = resKN.data.content;
      if (!dataKN || dataKN.length === 0) {
        return;
      }
      this.danhSachKghiemCluong = dataKN
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

  changePhieuKnghiem(event) {
    if (this.flagInit && event && event !== this.formData.value.soPhieuKiemNghiem) {
      this.formData.patchValue({
        idKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
        loaiHinhKho: null,
        hinhThucBaoQuan: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        idKtvBaoQuan: null,
        tenKtvBaoQuan: null,
        thoiGianGiaoNhan: null,
        donViTinh: null,
        theoChungTu: null,
        donGia: null,
      });
    }
  }

  async onChangeKnghiemCluong(id) {
    if (id <= 0) return;
    try {
      const res = await this.xhPhieuKnghiemCluongService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idQdNvDtl: data.idQdNvDtl,
        idPhieuKiemNghiem: data.id,
        soPhieuKiemNghiem: data.soPhieuKiemNghiem,
        ngayKiemNghiemMau: data.ngayKiemNghiemMau,
        idKho: data.idKho,
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
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        idKtvBaoQuan: data.idNguoiKiemNghiem,
        tenKtvBaoQuan: data.tenNguoiKiemNghiem,
        thoiGianGiaoNhan: data.tgianGiaoHang,
        donViTinh: data.donViTinh,
        hinhThucBaoQuan: data.hinhThucBaoQuan,
      });
      await this.loadLoaiHinhKho(data);
      if (this.dataTable && this.dataTable.length > 0) {
        let soLuongDonGia = this.dataTable.find(item => item.id === data.idKho);
        if (soLuongDonGia) {
          this.formData.patchValue({
            theoChungTu: soLuongDonGia.soLuong,
            donGia: soLuongDonGia.donGia,
          });
        }
      }

    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
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

  setValidForm() {
    const requiredFields = [
      "ngayLapPhieu",
      "soQdNv",
      "ngayKyQdNv",
      "soPhieuKiemNghiem",
      "tenNganLoKho",
      "tenNhaKho",
      "tenDiemKho",
      "thoiGianGiaoNhan",
      "ghiChu",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
