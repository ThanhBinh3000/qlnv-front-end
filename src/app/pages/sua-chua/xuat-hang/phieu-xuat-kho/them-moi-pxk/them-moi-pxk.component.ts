import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { QuyetDinhXhService } from "../../../../../services/sua-chua/quyetDinhXh.service";
import { QuyetDinhScService } from "../../../../../services/sua-chua/quyetDinhSc.service";
import dayjs from "dayjs";
import { Validators } from "@angular/forms";
import * as moment from "moment/moment";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { STATUS } from "../../../../../constants/status";
import { Base3Component } from "../../../../../components/base3/base3.component";
import { cloneDeep, chain } from 'lodash';
import { PhieuXuatKhoScService } from "../../../../../services/sua-chua/phieuXuatKhoSc.service";
import { MESSAGE } from "../../../../../constants/message";
import { convertTienTobangChu } from "../../../../../shared/commonFunction";

@Component({
  selector: 'app-them-moi-pxk',
  templateUrl: './them-moi-pxk.component.html',
  styleUrls: ['./them-moi-pxk.component.scss']
})
export class ThemMoiPxkComponent extends Base3Component implements OnInit {

  dataTableDiaDiem: any[] = [];
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
    private phieuXuatKhoScService: PhieuXuatKhoScService,

    private quyetDinhXhService: QuyetDinhXhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, phieuXuatKhoScService);
    this.defaultURL = 'sua-chua/xuat-hang/phieu-xuat-kho';
    this.previewName = 'sc_phieu_xuat_kho'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],
      soPhieuXuatKho: ['', [Validators.required]],
      ngayTao: [''],
      ngayXuatKho: [''],
      soNo: [''],
      soCo: [''],
      soQdXh: ['', [Validators.required]],
      idQdXh: ['', [Validators.required]],
      ngayQdXh: ['', [Validators.required]],
      idScDanhSachHdr: ['', [Validators.required]],
      maDiaDiem: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      tenLoKho: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
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
      soBangKeCanHang: [''],
      ghiChu: [''],
      tongSoLuong: [''],
      lyDoTuChoi: ['']
    });
    this.symbol = '/PXK-' + this.userInfo.DON_VI.tenVietTat;
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
    this.spinner.show();
    if (this.id) {
      await this.detail(this.id).then((res) => {
        if (res) {
          let data = res.children[0];
          this.rowItem = {
            donViTinh: data.donViTinh,
            tenMatHang: data.tenMatHang,
            slDaDuyet: data.slDaDuyet
          }
          this.dataTable = res.children;
          this.bindingDiaDiemXh(res.idQdXh)
        }
      })
    } else {
      await this.userService.getId("SC_PHIEU_XUAT_KHO_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soPhieuXuatKho: res + '/' + this.formData.value.nam + this.symbol,
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          ngayTao: dayjs().format('YYYY-MM-DD'),
          ngayXuatKho: dayjs().format('YYYY-MM-DD'),
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
          item.ngayXuat = item.thoiHanXuat
          item.ngayNhap = item.thoiHanNhap
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
            this.bindingDiaDiemXh(data.id)
          }
        });
      }
    })
  }

  bindingDiaDiemXh(id) {
    this.spinner.show();
    this.quyetDinhXhService.getDetail(id).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const data = res.data
        this.formData.patchValue({
          soQdXh: data.soQd,
          idQdXh: data.id,
          ngayQdXh: data.ngayKy
        })
        this.dataTableDiaDiem = []
        data.scQuyetDinhSc.scTrinhThamDinhHdr.children.forEach(item => {
          // Filter các đơn vị chi cục
          if(item.scDanhSachHdr.maDiaDiem.includes(this.userInfo.MA_DVI)){
            this.dataTableDiaDiem.push(item.scDanhSachHdr);
          }
        })
      }
    });
  }

  openDialogDiaDiem() {
    if (this.disabled()) {
      return;
    }
    console.log(this.dataTableDiaDiem);
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách hàng DTQG được sửa chữa',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dataTableDiaDiem,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Tên loại', 'Tên chủng loại', 'Số luợng đã duyệt', 'Đơn giá đã duyệt'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'tenLoaiVthh', 'tenCloaiVthh', 'slDaDuyet', 'donGiaPd']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.spinner.show();
        this.dataTable = [];
        await this.formData.patchValue({
          idScDanhSachHdr: data.id,
          maDiaDiem: data.maDiaDiem,
          tenDiemKho: data.tenDiemKho,
          tenNhaKho: data.tenNhaKho,
          tenNganKho: data.tenNganKho,
          tenLoKho: data.tenLoKho,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          donViTinh: data.donViTinh,
        })
        this.rowItem = {
          tenMatHang: data.tenCloaiVthh,
          donViTinh: data.donViTinh,
          slDaDuyet: data.slDaDuyet
        }
        this.spinner.hide();
      }
    });
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC) && this.userService.isAccessPermisson('SCHDTQG_XH_PXK_THEM');
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.info(MESSAGE.NOTIFICATION, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    if (this.formData.value.tongSoLuong == null || this.formData.value.tongSoLuong <= 0) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, "Tổng số lượng xuất phải lớn hơn 0");
      return;
    }
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
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
    return trangThai == STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson('SCHDTQG_XH_PXK_DUYET_LDCCUC');
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
    if (this.rowItem.slThucTe && this.rowItem.maSo && this.rowItem.slDaDuyet) {
      if (this.dataTable.filter(i => i.maSo == this.rowItem.maSo).length > 0) {
        this.notification.error(MESSAGE.ERROR, "Mã số đã tồn tại");
        return false
      }
      if (this.rowItem.slThucTe <= 0) {
        this.notification.error(MESSAGE.ERROR, "Số lượng thực tế phải lớn hơn 0");
        return false
      }
      let tongSl = this.calTongSlThucTe();
      if (tongSl + this.rowItem.slThucTe > this.rowItem.slDaDuyet) {
        this.notification.error(MESSAGE.ERROR, "Số lượng thực tế không được lớn hơn số lượng phê duyệt");
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
        sum += this.nvl(item.slThucTe);
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
