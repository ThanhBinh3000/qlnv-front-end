import { Component, OnInit, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { UserLogin } from 'src/app/models/userlogin';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemNghiemChatLuongHang.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {STATUS} from "../../../../../constants/status";
import {Base2Component} from "../../../../../components/base2/base2.component";

@Component({
  selector: 'app-quan-ly-phieu-kiem-nghiem-chat-luong',
  templateUrl: './quan-ly-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class QuanLyPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() typeVthh: string;
  toDay = new Date();
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  isView = false;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  searchFilter = {
    namKhoach: '',
    soQuyetDinh: '',
    soPhieuKncl: '',
    soBbBanGiao: '',
    soBbNhapDayKho: '',
  };
  listDiemKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  idVthh: number;
  routerVthh: string;
  isTatCa: boolean = false;

  userInfo: UserLogin;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  isDetail: boolean = false;
  selectedId: number = 0;

  allChecked = false;
  indeterminate = false;
  tuNgayKncl: Date | null = null;
  denNgayKncl: Date | null = null;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongHangService);
  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      if (this.typeVthh == 'tat-ca') {
        this.isTatCa = true;
      }
      this.userInfo = this.userService.getUserLogin();
      await this.search();
      await this.checkPriceAdjust('xuất hàng');
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.globals.prop.NHAP_DU_THAO) {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  async search() {
    await this.spinner.show();
    let body = {
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.typeVthh,
      trangThai: this.STATUS.BAN_HANH,
      namNhap: this.searchFilter.namKhoach,
      soQd: this.searchFilter.soQuyetDinh,
      soPhieuKncl: this.searchFilter.soPhieuKncl,
      soBbBanGiao: this.searchFilter.soBbBanGiao,
      soBbNhapDayKho: this.searchFilter.soBbNhapDayKho,
      tuNgayKncl: this.tuNgayKncl != null ? dayjs(this.tuNgayKncl).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayKncl: this.denNgayKncl != null ? dayjs(this.denNgayKncl).format('YYYY-MM-DD') + " 24:59:59" : null,
    };
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      // this.dataTable.forEach(item => {
      //   if (this.userService.isChiCuc()) {
      //     item.detail = item.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
      //   } else {
      //     let data = [];
      //     item.dtlList.forEach(item => {
      //       data = [...data, ...item.listBienBanLayMau];
      //     })
      //     item.detail = {
      //       listBienBanLayMau: data
      //     }
      //   };
      // });
      this.dataTableAll = cloneDeep(this.dataTable);
      for (let i = 0; i < this.dataTable.length; i++) {
        if (this.dataTable[i].listPhieuKiemNghiemCl !=null && this.dataTable[i].listPhieuKiemNghiemCl.length > 0) {
          this.expandSet.add(i);
        }
      }
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      if (this.page === 1) {
        await this.search();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearFilter() {
    this.searchFilter = {
      namKhoach: '',
      soQuyetDinh: '',
      soPhieuKncl: '',
      soBbBanGiao: '',
      soBbNhapDayKho: '',
    };
    this.tuNgayKncl = null;
    this.denNgayKncl = null;
    this.search();
  }

  xoaItem(data) {
    if (this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          const res = await this.phieuKiemNghiemChatLuongHangService.delete({ id: data.id });
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            this.search();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }

  deleteSelect() {
    const dataDelete = this.dataTable
      .filter((item) => item.checked)
      .map((item) => item.id);
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res =
              await this.phieuKiemNghiemChatLuongHangService.deleteMuti({
                ids: dataDelete,
              });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
            this.allChecked = false;
          }
        },
      });
    } else {
      this.notification.error(
        MESSAGE.ERROR,
        'Không có dữ liệu phù hợp để xóa.',
      );
    }
  }

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    if (id == 0 && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  filterInTable(key: string, value: string | Date) {
    if (value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }

    if (value && value != '') {
      this.dataTable = this.dataTableAll.filter((item) =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      );
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  async export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          loaiVthh: this.typeVthh,
          trangThai: this.STATUS.BAN_HANH,
          namNhap: this.searchFilter.namKhoach,
          soQd: this.searchFilter.soQuyetDinh,
          soPhieuKncl: this.searchFilter.soPhieuKncl,
          soBbBanGiao: this.searchFilter.soBbBanGiao,
          soBbNhapDayKho: this.searchFilter.soBbNhapDayKho,
          tuNgayKncl: this.tuNgayKncl != null ? dayjs(this.tuNgayKncl).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayKncl: this.denNgayKncl != null ? dayjs(this.denNgayKncl).format('YYYY-MM-DD') + " 24:59:59" : null,
          pageNumber: this.page,
          pageSize: this.pageSize,
        };
        const blob = await this.phieuKiemNghiemChatLuongHangService.export(
          body,
        );
        saveAs(blob, 'danh-sach-phieu-kiem-nghiem-chat-luong.xlsx');
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  printTable() {
    let WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    let printContent = '';
    printContent = printContent + '<div>';
    printContent =
      printContent + document.getElementById('table-phieu-kncl').innerHTML;
    printContent = printContent + '</div>';
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_PKNCL_XEM') && data != null) {
      if(this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_PKNCL_THEM') && (data.trangThai == STATUS.DU_THAO
        || data.trangThai == STATUS.TU_CHOI_LDC
      || data.trangThai == STATUS.TU_CHOI_TP)) {
        return false;
      } else if ((this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_PKNCL_DUYET_TP') && data.trangThai == STATUS.CHO_DUYET_TP)
      || (this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_PKNCL_DUYET_LDCUC') && data.trangThai == STATUS.CHO_DUYET_LDC)) {
        return false;
      }
      return true;
    }
    return false;
  }

  disabledTuNgayKn = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKncl) {
      return false;
    }
    return startValue.getTime() > this.denNgayKncl.getTime();
  };

  disabledDenNgayKn = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKncl) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKncl.getTime();
  };
}
