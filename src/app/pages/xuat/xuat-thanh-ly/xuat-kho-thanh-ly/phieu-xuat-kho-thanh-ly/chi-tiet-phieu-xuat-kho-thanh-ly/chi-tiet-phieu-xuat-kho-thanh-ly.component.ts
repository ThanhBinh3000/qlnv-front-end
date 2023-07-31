import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {
  XhPhieuKnghiemCluongService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/xhPhieuKnghiemCluong.service";
import {
  PhieuXuatKhoService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";
import {MESSAGE} from "../../../../../../constants/message";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {
  PhieuXuatKhoThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuXuatKhoThanhLy.service";
import {STATUS} from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../../../shared/commonFunction";

@Component({
  selector: 'app-chi-tiet-phieu-xuat-kho-thanh-ly',
  templateUrl: './chi-tiet-phieu-xuat-kho-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-phieu-xuat-kho-thanh-ly.component.scss']
})
export class ChiTietPhieuXuatKhoThanhLyComponent extends Base2Component implements OnInit {

  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() idBbQd: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  maPhieu: string;
  flagInit: Boolean = false;

  listLoaiHinhNx: any = [];
  listKieuNx: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNhiemVuThanhLyService: QuyetDinhGiaoNhiemVuThanhLyService,
    private xhPhieuKnghiemCluongService: XhPhieuKnghiemCluongService,
    private phieuXuatKhoThanhLyService: PhieuXuatKhoThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoThanhLyService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [],
        maDvi: [''],
        tenDvi: [''],
        maQhNs: [''],
        soPhieuXuatKho: [''],
        ngayTaoPhieu: [''],
        ngayXuatKho: [''],
        taiKhoanNo: [],
        taiKhoanCo: [],
        idBbQd: [],
        soBbQd: [''],
        ngayKyBbQd: [''],
        idHopDong: [],
        soHopDong: [''],
        ngayKyHopDong: [''],
        maDiaDiem: [''],
        tenCuc: [''],
        tenChiCuc: [''],
        tenDiemKho: [''],
        tenNhaKho: [''],
        tenNganKho: [''],
        tenLoKho: [''],
        idPhieuKnCl: [],
        soPhieuKnCl: [''],
        ngayKnCl: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        tenVthh: [''],
        idNguoiLapPhieu: [],
        tenNguoiLapPhieu: [''],
        ktvBaoQuan: [''],
        keToanTruong: [''],
        tenNguoiGiao: [''],
        cmtNguoiGiao: [''],
        congTyNguoiGiao: [''],
        diaChiNguoiGiao: [''],
        thoiGianGiaoNhan: [''],
        loaiHinhNx: [''],
        tenLoaiHinhNx: [''],
        kieuNx: [''],
        tenKieuNx: [''],
        idBangCanKeHang: [],
        soBangCanKeHang: [''],
        maSo: [''],
        donViTinh: [''],
        theoChungTu: [],
        thucXuat: [],
        donGia: [],
        thanhTien: [],
        ghiChu: [],
        trangThai: [''],
        lyDoTuChoi: [''],
        nguoiPduyetId: [],
        tenNguoiPduyet: [''],
        fileDinhKem: [new Array<FileDinhKem>()],
      }
    );
  }

  async ngOnInit() {
    try {
      this.maPhieu = 'PXK-' + this.userInfo.DON_VI.tenVietTat;
      this.spinner.show();
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
      this.flagInit = true;
    }
  }

  pheDuyet() {

  }

  tuChoi() {

  }

  async save() {

  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {

  }

  async openDialogSoQd() {

  }

  changeSoQd(event) {

  }

  changeDd(event) {

  }

  openDialogDdiemNhapHang() {

  }

  calculateSum() {
    let sum = this.formData.value.thucXuat * this.formData.value.donGia;
    return sum;
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  clearItemRow(id) {
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }

}
