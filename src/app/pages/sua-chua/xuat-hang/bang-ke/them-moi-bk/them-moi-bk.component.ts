import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { PhieuXuatKhoScService } from "../../../../../services/sua-chua/phieuXuatKhoSc.service";
import { QuyetDinhXhService } from "../../../../../services/sua-chua/quyetDinhXh.service";
import dayjs from "dayjs";
import { Validators } from "@angular/forms";
import * as moment from "moment";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { STATUS } from "../../../../../constants/status";
import { MESSAGE } from "../../../../../constants/message";
import { convertTienTobangChu } from "../../../../../shared/commonFunction";
import { Base3Component } from "../../../../../components/base3/base3.component";
import { cloneDeep, chain } from 'lodash';
import { BangKeXuatScService } from "../../../../../services/sua-chua/bangKeXuatSc.service";

@Component({
  selector: 'app-them-moi-bk',
  templateUrl: './them-moi-bk.component.html',
  styleUrls: ['./them-moi-bk.component.scss']
})
export class ThemMoiBkComponent extends Base3Component implements OnInit {
  dataTablePhieuXuatKho: any[] = [];
  rowItem: any = {};
  symbol: string = ''
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private bangKeXuatScService: BangKeXuatScService,
    private phieuXuatKhoScService: PhieuXuatKhoScService,
    private quyetDinhXhService: QuyetDinhXhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, bangKeXuatScService);
    this.defaultURL = 'sua-chua/xuat-hang/bang-ke';
    this.previewName = 'sc_bang_ke_xvt'
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
      soQdXh: ['', [Validators.required]],
      idQdXh: ['', [Validators.required]],
      ngayQdXh: ['',],
      soPhieuXuatKho: ['', [Validators.required]],
      idPhieuXuatKho: ['', [Validators.required]],
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
      lyDoTuChoi: []
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
          this.bindingDataQdXuatHang(res.idQdXh);
          this.bindingDataPhieuXuatKho(res.idPhieuXuatKho);
        }
      })
    } else {
      await this.userService.getId("SC_BANG_KE_XUAT_VT_HDR_SEQ").then((res) => {
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
    this.quyetDinhXhService.getDanhSachTaoPhieuXuatKho({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayNhap = item.thoiHanNhap;
          item.ngayXuat = item.thoiHanXuat;
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định giao nhiệm vụ xuất hàng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định xuất hàng', 'Trích yếu', 'Ngày ký', 'Thời hạn xuất', 'Thời hạn nhập'],
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
    this.quyetDinhXhService.getDetail(id).then((res) => {
      if (res.data) {
        const data = res.data
        this.formData.patchValue({
          soQdXh: data.soQd,
          idQdXh: data.id,
          ngayQdXh: data.ngayKy
        })
      }
      this.spinner.hide();
    });
  }

  openDialogPhieuXuatKho() {
    if (!this.formData.value.idQdXh) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn số quyết định giao nhiệm vụ xuất hàng");
      return;
    }
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.phieuXuatKhoScService.getDanhSachTaoBangKe({ idQdXh: this.formData.value.idQdXh }).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayXuatKhoFr = moment(item.ngayXuatKho).format('DD/MM/yyyy');
          item.thoiHanXuatFr = moment(item.thoiHanXuat).format('DD/MM/yyyy');
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách phiếu xuất kho',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số phiếu xuất kho', 'Ghi chú'],
            dataColumn: ['soPhieuXuatKho', 'ghiChu']
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

  bindingDataPhieuXuatKho(idPhieuXuatKho) {
    this.spinner.show();
    this.phieuXuatKhoScService.getDetail(idPhieuXuatKho).then((res) => {
      const data = res.data;
      this.formData.patchValue({
        soPhieuXuatKho: data.soPhieuXuatKho,
        idPhieuXuatKho: data.id,
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
    return ( trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC )
      && this.userService.isAccessPermisson('SCHDTQG_XH_BKXVT_THEM');
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
    return (trangThai == STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson('SCHDTQG_XH_BKXVT_DUYET_LDCCUC'));
  }

  addRow() {
    if (this.validateRow()) {
      let dataRow = cloneDeep(this.rowItem);
      this.dataTable.push(dataRow);
      this.rowItem.soLuong = 0;
      this.rowItem.soSerial = null;
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
