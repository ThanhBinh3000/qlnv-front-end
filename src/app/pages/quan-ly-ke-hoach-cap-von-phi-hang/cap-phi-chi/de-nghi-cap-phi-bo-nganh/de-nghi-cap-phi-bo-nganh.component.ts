import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT,
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { DeNghiCapPhiBoNganhService } from 'src/app/services/ke-hoach/von-phi/deNghiCapPhiBoNganh.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { STATUS } from '../../../../constants/status';

@Component({
  selector: 'app-de-nghi-cap-phi-bo-nganh',
  templateUrl: './de-nghi-cap-phi-bo-nganh.component.html',
  styleUrls: ['./de-nghi-cap-phi-bo-nganh.component.scss'],
})
export class DeNghiCapPhiBoNganhComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private deNghiCapPhiBoNganhService: DeNghiCapPhiBoNganhService,
    private modal: NzModalService,
    public userService: UserService,
    private donviService: DonviService,
    public globals: Globals,
    private danhMucService: DanhMucService,
  ) {
  }

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  STATUS = STATUS;
  isDetail: boolean = false;
  listNam: any[] = [];
  listBoNganh: any[] = [];
  listTrangThai: any[] = [
    { ma: STATUS.DANG_NHAP_DU_LIEU, giaTri: 'Đang nhập dữ liệu' },
    { ma: STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];

  yearNow: number = 0;
  searchFilter = {
    soDeNghi: '',
    tenBoNganh: '',
    nam: '',
    ngayDeNghiTuNgay: '',
    ngayDeNghiDenNgay: '',
  };
  filterTable: any = {
    soDeNghi: '',
    tenBoNganh: '',
    ngayDeNghi: '',
    nam: '',
    tongTien: '',
    kinhPhiDaCap: '',
    ycCapThem: '',
    tenTrangThai: '',
  };
  dataTableAll: any[] = [];
  listVthh: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  detail: any = {};

  selectedId: number = 0;

  isVatTu: boolean = false;

  allChecked = false;
  indeterminate = false;

  isView = false;

  async ngOnInit() {
    try {
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.getListNam();
      this.getListBoNganh();
      this.initData();
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == STATUS.DANG_NHAP_DU_LIEU) {
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
    this.spinner.show();
    let body = {
      soDeNghi: this.searchFilter.soDeNghi ? this.searchFilter.soDeNghi : '',
      capDvis: [],
      maBoNganh: this.searchFilter.tenBoNganh ? this.searchFilter.tenBoNganh : '',
      maDvis: [this.detail.maDvi],
      nam: this.searchFilter.nam ? this.searchFilter.nam : '',
      ngayDeNghiTuNgay: this.searchFilter.ngayDeNghiTuNgay ? this.searchFilter.ngayDeNghiTuNgay : '',
      ngayDeNghiDenNgay: this.searchFilter.ngayDeNghiDenNgay ? this.searchFilter.ngayDeNghiDenNgay : '',
      trangThai: '',
      trangThais: [],
      pageNumber: this.page,
      pageSize: this.pageSize,
    };
    let res = await this.deNghiCapPhiBoNganhService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  getListNam() {
    this.yearNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: this.yearNow - i,
        text: this.yearNow - i,
      });
    }
  }

  async getListBoNganh() {
    this.listBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listBoNganh = res.data.filter(item => item.code != 'BTC' && item.code != 'BQP' && item.code != 'BCA');
    }
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

  themMoi() {
    this.isDetail = true;
    this.isView = false;
    if (this.userService.isTongCuc()) {
      this.isVatTu = true;
    } else {
      this.isVatTu = false;
    }
    this.selectedId = 0;
    this.loaiVthh = this.loaiVthhCache;
  }

  showList() {
    this.isDetail = false;
    this.search();
  }

  viewDetail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.loaiVthh = data.loaiVthh;
    this.isView = isView;
    // if (data.loaiVthh.startsWith('02')) {
    //   this.isVatTu = true;
    // } else {
    //   this.isVatTu = false;
    // }
  }

  clearFilter() {
    // this.searchFilter.nam = dayjs().get('year');
    this.searchFilter.soDeNghi = '';
    this.searchFilter.ngayDeNghiTuNgay = '';
    this.searchFilter.ngayDeNghiDenNgay = '';
    this.searchFilter.tenBoNganh = '';
    this.searchFilter.nam = '';

    this.filterTable = {
      'soDeNghi': '',
      'tenBoNganh': '',
      'ngayDeNghi': '',
      'nam': '',
      'trangThaiId': '',
      'tenTrangThai': '',
      'tongTien': '',
      'kinhPhiDaCap': '',
      'ycCapThem': '',
    };
    this.search();

  }

  xoaItem(item: any) {
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
          this.deNghiCapPhiBoNganhService.deleteData(item.id).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  convertTrangThai(status: string) {
    switch (status) {
      case '00': {
        return 'Dự thảo';
      }
      case '03': {
        return 'Từ chối - TP';
      }
      case '12': {
        return 'Từ chối - LĐ Cục';
      }
      case '01': {
        return 'Chờ duyệt - TP';
      }
      case '09': {
        return 'Chờ duyệt - LĐ Cục';
      }
      case '02': {
        return 'Đã duyệt';
      }
      case '05': {
        return 'Tổng hợp';
      }
    }
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          pageNumber: this.page,
          pageSize: this.pageSize,
        };
        this.deNghiCapPhiBoNganhService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-thong-tin.xlsx'),
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
            const body = {
              ids: dataDelete,
            };
            let res = await this.deNghiCapPhiBoNganhService.deleteMultiple(body);
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
    } else {
      this.notification.error(
        MESSAGE.ERROR,
        'Không có dữ liệu phù hợp để xóa.',
      );
    }
  }

  // Tìm kiếm trong bảng
  filterInTable(key: string, value: string, date: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (date) {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase() === dayjs(value).format('YYYY-MM-DD')) {
              temp.push(item);
            }
          });
        } else {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item);
            }
          });
        }
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

}
