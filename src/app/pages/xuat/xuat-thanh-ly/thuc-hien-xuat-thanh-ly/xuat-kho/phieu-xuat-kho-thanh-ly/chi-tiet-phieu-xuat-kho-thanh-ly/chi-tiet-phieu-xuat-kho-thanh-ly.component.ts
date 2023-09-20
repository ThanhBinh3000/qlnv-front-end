import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {
  XhPhieuKnghiemCluongService
} from "../../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/xhPhieuKnghiemCluong.service";
import {
  PhieuXuatKhoThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuXuatKhoThanhLy.service";
import dayjs from "dayjs";
import {FileDinhKem} from "../../../../../../../models/CuuTro";
import {MESSAGE} from "../../../../../../../constants/message";
import {STATUS} from "../../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";

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
  listSoQuyetDinh: any = [];
  listDiaDiemXuat: any = [];
  listPhieuXk: any = [];
  templateName = "Phiếu xuất kho";
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
        nam: [dayjs().get("year")],
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
        tenTrangThai: [''],
        lyDoTuChoi: [''],
        nguoiPduyetId: [],
        tenNguoiPduyet: [''],
        fileDinhKem: [new Array<FileDinhKem>()],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show()
    try {
      this.userInfo = this.userService.getUserLogin();
      this.maPhieu = 'PXK-' + this.userInfo.DON_VI.tenVietTat;
      if (this.idInput) {
        await this.loadDetail(this.idInput);
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_TL_XUAT_KHO_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      tenNguoiLapPhieu: this.userInfo.TEN_DAY_DU,
      soPhieuXuatKho: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
      ngayTaoPhieu: dayjs().format('YYYY-MM-DD'),
      ngayXuatKho: dayjs().format('YYYY-MM-DD'),
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    });
    if (this.idBbQd > 0) {
      await this.bindingDataQd(this.idBbQd);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.detail(idInput);
    }
  }

  async openDialogSoQd() {
    await this.spinner.show();
    let body = {
      nam: this.formData.value.nam,
      trangThai: this.STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNhiemVuThanhLyService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        this.listSoQuyetDinh = data;
        this.listSoQuyetDinh = this.listSoQuyetDinh.filter(item => item.quyetDinhDtl.some(child => child.maDiaDiem.substring(0, 8) === this.userInfo.MA_DVI));
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soBbQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id);
      }
    });
    await this.spinner.hide();
  }

  changeSoQd(event) {
  }

  changeDd(event) {
  }

  async bindingDataQd(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.quyetDinhGiaoNhiemVuThanhLyService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQd = res.data
            this.formData.patchValue({
              idBbQd: dataQd.id,
              soBbQd: dataQd.soBbQd,
              ngayKyBbQd: dataQd.ngayKy,
              idHopDong: dataQd.idHopDong,
              soHopDong: dataQd.soHopDong,
              ngayKyHopDong: dataQd.ngayKyHopDong,
              loaiHinhNx: dataQd.loaiHinhNx,
              tenLoaiHinhNx: dataQd.tenLoaiHinhNx,
              kieuNx: dataQd.kieuNx,
              tenKieuNx: dataQd.tenKieuNx,
              donViTinh: dataQd.donViTinh,
            });
            await this.loadDsPhieuXk(dataQd.soBbQd);
            let dataChiCuc = dataQd.quyetDinhDtl.filter(item => item.maDiaDiem.substring(0, 8) === this.userInfo.MA_DVI);
            if (dataChiCuc) {
              this.listDiaDiemXuat = [];
              this.listDiaDiemXuat = [...this.listDiaDiemXuat, dataChiCuc];
              this.listDiaDiemXuat = this.listDiaDiemXuat.flat();
              let set1 = new Set(this.listPhieuXk.map(item => JSON.stringify({
                maDiaDiem: item.maDiaDiem,
              })));
              this.listDiaDiemXuat = this.listDiaDiemXuat.filter(item => {
                const key = JSON.stringify({
                  maDiaDiem: item.maDiaDiem,
                });
                return !set1.has(key);
              });
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async loadDsPhieuXk(event) {
    let body = {
      soBbQd: event,
      nam: this.formData.value.nam,
    }
    let res = await this.phieuXuatKhoThanhLyService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {

        this.listPhieuXk = data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogDdiemNhapHang() {
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
          maDiaDiem: data.maDiaDiem,
          tenDiemKho: data.tenDiemKho,
          tenNhaKho: data.tenNhaKho,
          tenNganKho: data.tenNganKho,
          tenLoKho: data.tenLoKho,
          donGia: data.giaTlKhongVat,
          theoChungTu: data.slDauGia,
        });
      }
    });
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = this.formData.value;
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string) {
    if (this.formData.value.soBangCanKeHang) {
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } else {
      this.notification.error(MESSAGE.ERROR, "Phiếu xuất kho chưa có bảng kê cân hàng");
    }
  }

  calculateSum() {
    let sum = this.formData.value.thucXuat * this.formData.value.donGia;
    return sum;
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  clearItemRow(id) {
    this.formData.patchValue({
      maSo: null,
      theoChungTu: null,
      thucXuat: null,
    })
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }
}
