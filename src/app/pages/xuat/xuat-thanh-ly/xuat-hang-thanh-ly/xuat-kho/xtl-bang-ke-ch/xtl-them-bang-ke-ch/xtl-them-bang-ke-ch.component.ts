import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {BangKeXuatScService} from "../../../../../../../services/sua-chua/bangKeXuatSc.service";
import {PhieuXuatKhoScService} from "../../../../../../../services/sua-chua/phieuXuatKhoSc.service";
import {QuyetDinhXhService} from "../../../../../../../services/sua-chua/quyetDinhXh.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {MESSAGE} from "../../../../../../../constants/message";
import * as moment from "moment/moment";
import {STATUS} from "../../../../../../../constants/status";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {Base3Component} from "../../../../../../../components/base3/base3.component";
import { cloneDeep } from 'lodash';
import {
  PhieuXuatKhoThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuXuatKhoThanhLy.service";
import {
  BangCanKeHangThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/BangCanKeHangThanhLy.service";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";

@Component({
  selector: 'app-xtl-them-bang-ke-ch',
  templateUrl: './xtl-them-bang-ke-ch.component.html',
  styleUrls: ['./xtl-them-bang-ke-ch.component.scss']
})
export class XtlThemBangKeChComponent extends Base3Component implements OnInit {
  rowItem: any = {};
  symbol: string = '';
  phanLoai : string;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: BangCanKeHangThanhLyService,
    private phieuXuatKhoThanhLyService: PhieuXuatKhoThanhLyService,
    private quyetDinhXhService: QuyetDinhXhService,
    private quyetDinhGiaoNhiemVuThanhLyService : QuyetDinhGiaoNhiemVuThanhLyService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-bang-ke-ch';
      this.phanLoai = urlList[4] == 'xuat-kho-lt' ? 'LT' : 'VT'
    })
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
      ngayLap: ['', [Validators.required]],
      soQdXh: ['', [Validators.required]],
      idQdXh: ['', [Validators.required]],
      ngayQdXh: ['',],
      soPhieuXuatKho: ['', [Validators.required]],
      idPhieuXuatKho: ['', [Validators.required]],
      idDsHdr : ['', [Validators.required]],
      maDiaDiem : ['', [Validators.required]],
      tenDiemKho: ['',],
      tenNhaKho: ['',],
      tenNganKho: ['',],
      tenLoKho: ['',],
      diaDiemKho: [''],
      nguoiGiamSat : [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      loaiVthh : [''],
      cloaiVthh : [''],
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
      lyDoTuChoi: [],
      tongTrongLuong : ['']
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
          this.bindingDataPhieuXuatKho(res.idPhieuXuatKho);
        }
      })
    } else {
      await this.userService.getId("XH_TL_BANG_KE_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soBangKe: res + '/' + this.formData.value.nam + this.symbol,
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          ngayLap: dayjs().format('YYYY-MM-DD'),
          tenThuKho: this.userInfo.TEN_DAY_DU
        })
      });
    };
  }

  openDialogQdGiaoNvxh() {
    if (this.disabled()) {
      return;
    }
    let body = {
      trangThai : STATUS.BAN_HANH,
      nam : this.formData.value.nam,
      phanLoai : this.phanLoai
    }
    this.spinner.show();
    this.quyetDinhGiaoNhiemVuThanhLyService.getAll(body).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định giao nhiệm vụ xuất hàng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định xuất hàng'],
            dataColumn: ['soBbQd']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.formData.patchValue({
              idQdXh : data.id,
              soQdXh : data.soBbQd,
              ngayQdXh: data.ngayKy
            })
          }
        });
      }
    })
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
    let body = {
      idQdXh: this.formData.value.idQdXh,
      trangThai : STATUS.DU_THAO,
      phanLoai : this.phanLoai
    }
    this.phieuXuatKhoThanhLyService.getDanhSachTaoBangKe(body).then((res) => {
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
    this.phieuXuatKhoThanhLyService.getDetail(idPhieuXuatKho).then((res) => {
      const data = res.data;
      this.formData.patchValue({
        soPhieuXuatKho: data.soPhieuXuatKho,
        idPhieuXuatKho: data.id,
        idDsHdr : data.idDsHdr,
        maDiaDiem : data.maDiaDiem,
        tenDiemKho: data.tenDiemKho,
        tenNhaKho: data.tenNhaKho,
        tenNganKho: data.tenNganKho,
        tenLoKho: data.tenLoKho,
        diaDiemKho: data.diaDiemKho,
        loaiVthh : data.loaiVthh,
        cloaiVthh : data.cloaiVthh,
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
    return (trangThai == STATUS.DU_THAO ) || (trangThai == STATUS.TU_CHOI_LDCC);
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
    return trangThai == STATUS.CHO_DUYET_LDCC;
  }

  addRow() {
    if (this.validateRow()) {
      let dataRow = cloneDeep(this.rowItem);
      this.dataTable.push(dataRow);
      this.rowItem.maCan = null;
      this.rowItem.soBaoBi = 0;
      this.rowItem.trongLuongCaBi = 0;
      this.formData.patchValue({
        tongTrongLuong: this.calTongTable('soLuong')
      })
    }
  }

  deleteRow(i: number): void {
    this.dataTable = this.dataTable.filter((d, index) => index !== i);
  }

  validateRow(): boolean {
    if (this.rowItem.maCan && this.rowItem.soBaoBi && this.rowItem.trongLuongCaBi) {
      // if (this.dataTable.filter(i => i.soSerial == this.rowItem.soSerial).length > 0) {
      //   this.notification.error(MESSAGE.ERROR, "Số serial đã tồn tại");
      //   return false
      // }
      // if (this.rowItem.soLuong <= 0) {
      //   this.notification.error(MESSAGE.ERROR, "Số lượng thực tế phải lớn hơn 0");
      //   return false
      // }
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đủ thông tin");
      return false;
    }
    return true
  }

  calTongTable(columnName) {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        if(item.hasOwnProperty(columnName)){
          sum += this.nvl(item[columnName]);
        }
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
