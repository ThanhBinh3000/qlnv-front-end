import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { UserLogin } from 'src/app/models/userlogin';
import { QuanLyBangKeVatTuService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyBangKeVatTu.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { StorageService } from 'src/app/services/storage.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import {Base2Component} from "../../../../../components/base2/base2.component";

@Component({
  selector: 'app-bang-ke-nhap-vat-tu',
  templateUrl: './bang-ke-nhap-vat-tu.component.html',
  styleUrls: ['./bang-ke-nhap-vat-tu.component.scss']
})
export class BangKeNhapVatTuComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  searchFilter = {
    namKhoach: '',
    soQuyetDinh: '',
    soBangKe: '',
    ngayTaoBangKe: '',
  };

  STATUS = STATUS

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganLo: any[] = [];

  userInfo: UserLogin;

  dataTable: any[] = [];
  dataTableAll: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  isDetail: boolean = false;
  selectedId: number = 0;
  idQdGiaoNvNh: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    soQuyetDinhNhap: '',
    soBangKe: '',
    ngayTaoBangKe: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganLo: '',
    tenTrangThai: '',
  };

  tuNgayNk: Date | null = null;
  denNgayNk: Date | null = null;
  tuNgayNhapHang: Date | null = null;
  denNgayNhapHang: Date | null = null;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayNk) {
      return false;
    }
    return startValue.getTime() > this.denNgayNk.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayNk) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayNk.getTime();
  };

  disabledTuNgayNhapHang = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayNhapHang) {
      return false;
    }
    return startValue.getTime() > this.denNgayNhapHang.getTime();
  };

  disabledDenNgayNhapHang = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayNhapHang) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayNhapHang.getTime();
  };
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLyBangKeVatTuService: QuanLyBangKeVatTuService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyBangKeVatTuService);
    super.ngOnInit();
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.search(),
      ]);
      await this.checkPriceAdjust('xuất hàng');
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
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
    if (this.dataTable.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  async search() {
    await this.spinner.show();
    let body = {
      soQd: this.searchFilter.soQuyetDinh,
      soBangKe: this.searchFilter.soBangKe,
      namNhap: this.searchFilter.namKhoach,
      tuNgayTgianNkho: this.tuNgayNhapHang != null ? dayjs(this.tuNgayNhapHang).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayTgianNkho: this.denNgayNhapHang != null ? dayjs(this.denNgayNhapHang).format('YYYY-MM-DD') + " 23:59:59" : null,
      tuNgayNk: this.tuNgayNk != null ? dayjs(this.tuNgayNk).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayNk: this.denNgayNk != null ? dayjs(this.denNgayNk).format('YYYY-MM-DD') + " 23:59:59" : null,
      trangThai: this.STATUS.BAN_HANH,
      paggingReq: {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.loaiVthh
    };
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.convertDataTable();
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  convertDataTable() {
    for (let i = 0; i < this.dataTable.length; i++) {
      if (this.userService.isChiCuc()) {
        this.dataTable[i].detail = this.dataTable[i].dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
      } else {
        let data = [];
        this.dataTable[i].dtlList.forEach(item => {
          data = [...data, ...item.children];
        })
        this.dataTable[i].detail = {
          children: data
        }
      };
      for (let j = 0; j < this.dataTable[i].detail.children.length; j++) {
        // this.dataTable[i].detail.children[j].listBangKeVt.forEach(x => {
        //   x.phieuNhapKho = this.dataTable[i].detail.children[j].listPhieuNhapKho.filter(item => item.soPhieuNhapKho == x.soPhieuNhapKho)[0];
        // });
        this.expandSet2.add(j)
      }
      this.expandSet.add(i)
    }
  }


  clearFilter() {
    this.searchFilter = {
      namKhoach: '',
      soQuyetDinh: '',
      soBangKe: '',
      ngayTaoBangKe: '',
    };
    this.tuNgayNhapHang = null;
    this.tuNgayNk = null;
    this.denNgayNhapHang = null;
    this.denNgayNk = null;
    this.search()
  }

  xoaItem(item: any) {
    if (this.checkPrice.boolean) {
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
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.quanLyBangKeVatTuService.delete({ id: item.id }).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDiemKho() {
    let res = await this.tinhTrangKhoHienThoiService.getAllDiemKho();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listDiemKho = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadNhaKho(diemKhoId: any) {
    let body = {
      "diemKhoId": diemKhoId,
      "maNhaKho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNhaKho": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nhaKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNhaKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadNganLo() {
    let body = {
      "maNganLo": null,
      "nganKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganLo": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganLoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganLo = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    if (id == 0 && this.checkPrice?.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.selectedId = id;
    this.idQdGiaoNvNh = idQdGiaoNvNh;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          soQd: this.searchFilter.soQuyetDinh,
          soBangKe: this.searchFilter.soBangKe,
          namNhap: this.searchFilter.namKhoach,
          tuNgayTgianNkho: this.tuNgayNhapHang != null ? dayjs(this.tuNgayNhapHang).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayTgianNkho: this.denNgayNhapHang != null ? dayjs(this.denNgayNhapHang).format('YYYY-MM-DD') + " 23:59:59" : null,
          tuNgayNk: this.tuNgayNk != null ? dayjs(this.tuNgayNk).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayNk: this.denNgayNk != null ? dayjs(this.denNgayNk).format('YYYY-MM-DD') + " 23:59:59" : null,
          trangThai: this.STATUS.BAN_HANH,
          paggingReq: {
            "limit": this.pageSize,
            "page": this.page - 1
          },
          loaiVthh: this.loaiVthh
        };
        this.quanLyBangKeVatTuService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bang-ke-vat-tu.xlsx'),
          );
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

  deleteSelect() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
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
            let res = await this.quanLyBangKeVatTuService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    }
    else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soQuyetDinhNhap: '',
      soBangKe: '',
      ngayTaoBangKe: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganLo: '',
      tenTrangThai: '',
    }
  }

  print() {

  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }

}
