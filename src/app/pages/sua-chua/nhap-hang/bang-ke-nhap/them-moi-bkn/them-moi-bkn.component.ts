import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { BangKeXuatScService } from "../../../../../services/sua-chua/bangKeXuatSc.service";
import { PhieuXuatKhoScService } from "../../../../../services/sua-chua/phieuXuatKhoSc.service";
import { QuyetDinhXhService } from "../../../../../services/sua-chua/quyetDinhXh.service";
import dayjs from "dayjs";
import { Validators } from "@angular/forms";
import * as moment from "moment/moment";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MESSAGE } from "../../../../../constants/message";
import { STATUS } from "../../../../../constants/status";
import { convertTienTobangChu } from "../../../../../shared/commonFunction";
import { Base3Component } from "../../../../../components/base3/base3.component";
import { cloneDeep, chain } from 'lodash';
import { BangKeNhapScService } from "../../../../../services/sua-chua/bangKeNhapSc.service";
import { PhieuNhapKhoScService } from "../../../../../services/sua-chua/phieuNhapKhoSc.service";
import { QuyetDinhNhService } from "../../../../../services/sua-chua/quyetDinhNh.service";


@Component({
  selector: 'app-them-moi-bkn',
  templateUrl: './them-moi-bkn.component.html',
  styleUrls: ['./them-moi-bkn.component.scss']
})
export class ThemMoiBknComponent extends Base3Component implements OnInit {

  rowItem: any = {};
  symbol: string = '';

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private bangKeNhapScService: BangKeNhapScService,
    private phieuNhapKhoScService: PhieuNhapKhoScService,

    private quyetDinhNhService: QuyetDinhNhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, bangKeNhapScService);
    this.defaultURL = 'sua-chua/nhap-hang/bang-ke-nhap';
    this.previewName = 'sc_bang_ke_nvt';
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],
      soBangKe: ['', [Validators.required]],
      ngayNhap: ['', [Validators.required]],
      soQdNh: ['', [Validators.required]],
      idQdNh: ['', [Validators.required]],
      ngayQdNh: ['',],
      soPhieuNhapKho: ['', [Validators.required]],
      idPhieuNhapKho: ['', [Validators.required]],
      ngayNhapKho: [''],
      tenDiemKho: ['',],
      tenNhaKho: ['',],
      tenNganKho: ['',],
      tenLoKho: ['',],
      diaDiemKho: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      donViTinh: [''],
      tenThuKho: [''],
      tenLanhDaoCc: [''],
      keToanTruong: [''],
      nguoiGiaoHang: [''],
      soCmt: [''],
      dviNguoiGiaoHang: [''],
      diaChi: [''],
      thoiGianGiaoNhan: [''],
      ngayXuatKho: [''],
      lyDoTuChoi: ['']
    });
    this.symbol = '/BKCH-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.getId(),
      await this.initForm()
    ]);
    this.spinner.hide();
  }

  async initForm() {
    if (this.id) {
      this.spinner.show();
      await this.detail(this.id).then((res) => {
        this.spinner.hide();
        if (res) {
          this.dataTable = res.children;
          this.bindingDataQdXuatHang(res.idQdNh);
          this.bindingDataPhieuXuatKho(res.idPhieuNhapKho);
        }
      })
    } else {
      await this.userService.getId("SC_BANG_KE_NHAP_VT_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soBangKe: res + '/' + this.formData.value.nam + this.symbol,
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          ngayNhap: dayjs().format('YYYY-MM-DD'),
          tenThuKho: this.userInfo.TEN_DAY_DU
        })
      });
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.quyetDinhNhService.getDanhSachTaoPhieuNhapKho({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayNhap = item.thoiHanNhap;
          item.ngayXuat = item.thoiHanXuat;
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định nhập hàng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định nhập hàng', 'Trích yếu', 'Ngày ký', 'Thời hạn xuất', 'Thời hạn nhập'],
            dataColumn: ['soQd', 'trichYeu', 'ngayKy', 'ngayXuat', 'ngayNhap']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.bindingDataQdXuatHang(data.id)
          }
        });
      }
    })
  }

  bindingDataQdXuatHang(id) {
    this.spinner.show();
    this.quyetDinhNhService.getDetail(id).then((res) => {
      if (res.data) {
        const data = res.data
        this.formData.patchValue({
          soQdNh: data.soQd,
          idQdNh: data.id,
          ngayQdNh: data.ngayKy
        })
      }
      this.spinner.hide();
    });
  }

  openDialogPhieuXuatKho() {
    if (!this.formData.value.idQdNh) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn số quyết định giao nhiệm vụ nhập hàng");
      return;
    }
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.phieuNhapKhoScService.getDanhSachTaoBangKe({ idQdNh: this.formData.value.idQdNh }).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách phiếu nhập kho',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số phiếu nhập kho', 'Ghi chú'],
            dataColumn: ['soPhieuNhapKho', 'ghiChu']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.bindingDataPhieuXuatKho(data.id)
          }
        });
      }
    })
  }

  bindingDataPhieuXuatKho(idPhieuNhapKho) {
    this.spinner.show();
    this.phieuNhapKhoScService.getDetail(idPhieuNhapKho).then((res) => {
      const data = res.data;
      this.formData.patchValue({
        soPhieuNhapKho: data.soPhieuNhapKho,
        idPhieuNhapKho: data.id,
        ngayNhapKho: data.ngayNhapKho,
        tenDiemKho: data.tenDiemKho,
        tenNhaKho: data.tenNhaKho,
        tenNganKho: data.tenNganKho,
        tenLoKho: data.tenLoKho,
        diaDiemKho: data.diaDiemKho,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        nguoiGiaoHang: data.nguoiGiaoHang,
        soCmt: data.soCmt,
        dviNguoiGiaoHang: data.dviNguoiGiaoHang,
        diaChi: data.diaChi,
        thoiGianGiaoNhan: data.thoiGianGiaoNhan,
        donViTinh: data.donViTinh,
        ngayXuatKho: data.ngayXuatKho
      })
      this.spinner.hide();
    });
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC) && this.userService.isAccessPermisson('SCHDTQG_NH_BKNVT_THEM');
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    let body = this.formData.value;
    body.children = this.dataTable;
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
    }
    this.approve(this.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
    }
    this.reject(this.id, trangThai);
  }

  disabled() {
    let trangThai = this.formData.value.trangThai;
    return !(trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC);
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson('SCHDTQG_NH_BKNVT_DUYETLDCCUC'));
  }

  addRow() {
    if (this.validateRow()) {
      let dataRow = cloneDeep(this.rowItem);
      this.dataTable.push(dataRow);
      this.rowItem.slThucTe = 0;
      this.rowItem.maSo = null;
      console.log(this.calTongSlThucTe());
      this.formData.patchValue({
        tongSoLuong: this.calTongSlThucTe()
      })
    }
  }

  deleteRow(i: number): void {
    this.dataTable = this.dataTable.filter((d, index) => index !== i);
  }

  validateRow(): boolean {
    if (this.rowItem.soSerial && this.rowItem.soLuong) {
      if (this.dataTable.filter(i => i.soSerial == this.rowItem.soSerial).length > 0) {
        this.notification.error(MESSAGE.ERROR, "Số serial đã tồn tại");
        return false
      }
      if (this.rowItem.soLuong <= 0) {
        this.notification.error(MESSAGE.ERROR, "Số lượng thực tế phải lớn hơn 0");
        return false
      }
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đủ thông tin");
      return false;
    }
    return true
  }

  calTongSlThucTe() {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        sum += this.nvl(item.soLuong);
      })
      return sum;
    }
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
  }

}
