import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { Subject } from 'rxjs';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QuanLyBienBanTinhKhoService } from 'src/app/services/quanLyBienBanTinhKho.service';
import { QuyetDinhGiaoNhiemVuXuatHangService } from 'src/app/services/quyetDinhGiaoNhiemVuXuatHang.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-bien-ban-tinh-kho',
  templateUrl: './bien-ban-tinh-kho.component.html',
  styleUrls: ['./bien-ban-tinh-kho.component.scss'],
})
export class BienBanTinhKhoComponent implements OnInit {
  @Input() typeVthh: string;

  searchFilter = {
    soBienBan: '',
    ngayBienBan: '',
    soQuyetDinh: '',
  };

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganLo: any[] = [];
  listSoQuyetDinh: any[] = [];
  userInfo: UserLogin;
  quyetDinhId: string = '';
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  dsSoQuyetDinhDataSource: any[] = [];
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    soQd: '',
    soBienBan: '',
    ngayBienBan: '',
    diemKho: '',
    nhaKho: '',
    nganKho: '',
    loKho: '',
    trangThaiDuyet: '',
  };

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyBienBanTinhKhoService: QuanLyBienBanTinhKhoService,
    private notification: NzNotificationService,
    private router: Router,
    public userService: UserService,
    private modal: NzModalService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNhiemVuXuatHangService,
    public globals: Globals,
  ) {}

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([this.search(), this.loadSoQuyetDinh()]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async loadSoQuyetDinh() {
    let body = {};
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
      this.dsSoQuyetDinhDataSource = this.listSoQuyetDinh.map(
        (item) => item.soQuyetDinh,
      );
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == '00') {
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
  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }
  async showList() {
    this.isDetail = false;
    await this.search();
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearFilter() {
    this.searchFilter = {
      soBienBan: '',
      ngayBienBan: '',
      soQuyetDinh: '',
    };
    this.search();
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
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
          this.quanLyBienBanTinhKhoService.deleteData(item.id).then((res) => {
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

  async search() {
    let body = {
      pageNumber: this.page,
      pageSize: this.pageSize,
      soBienBan: this.searchFilter.soBienBan,
      quyetDinhId: this.quyetDinhId,
      ngayXuatDen:
        this.searchFilter.ngayBienBan &&
        this.searchFilter.ngayBienBan.length > 1
          ? dayjs(this.searchFilter.ngayBienBan[1]).format('YYYY-MM-DD')
          : null,
      ngayXuatTu:
        this.searchFilter.ngayBienBan &&
        this.searchFilter.ngayBienBan.length > 0
          ? dayjs(this.searchFilter.ngayBienBan[0]).format('YYYY-MM-DD')
          : null,
      orderBy: null,
      orderType: null,
    };

    let res = await this.quanLyBienBanTinhKhoService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      console.log(data);
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  onChangeSoQuyetDinhAutoComplete(value: any) {
    if (value) {
      this.dsSoQuyetDinhDataSource = [...this.listSoQuyetDinh]
        .filter((item) =>
          item?.soQuyetDinh
            ?.toLowerCase()
            ?.includes(value.toString().toLowerCase()),
        )
        .map((item) => item.soQuyetDinh);
      this.quyetDinhId = [...this.listSoQuyetDinh]
        .filter((item) => item.soQuyetDinh === this.searchFilter.soQuyetDinh)[0]
        ?.id?.toString();
    } else {
      this.dsSoQuyetDinhDataSource = [...this.listSoQuyetDinh].map(
        (item) => item.soQuyetDinh,
      );
    }
  }
  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayXuatDen:
            this.searchFilter.ngayBienBan &&
            this.searchFilter.ngayBienBan.length > 1
              ? dayjs(this.searchFilter.ngayBienBan[1]).format('YYYY-MM-DD')
              : null,
          ngayXuatTu:
            this.searchFilter.ngayBienBan &&
            this.searchFilter.ngayBienBan.length > 0
              ? dayjs(this.searchFilter.ngayBienBan[0]).format('YYYY-MM-DD')
              : null,
          quyetDinhId: this.quyetDinhId,
          soBienBan: this.searchFilter.soBienBan,
        };

        this.quanLyBienBanTinhKhoService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-tinh-kho.xlsx'),
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
            let res = await this.quanLyBienBanTinhKhoService.deleteMultiple({
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

  filterInTable(key: string, value: string, date: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (date) {
          this.dataTableAll.forEach((item) => {
            if (
              item[key] &&
              item[key].toString().toLowerCase() ===
                dayjs(value).format('YYYY-MM-DD')
            ) {
              temp.push(item);
            }
          });
        } else {
          this.dataTableAll.forEach((item) => {
            if (
              item[key] &&
              item[key]
                .toString()
                .toLowerCase()
                .indexOf(value.toString().toLowerCase()) != -1
            ) {
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

  clearFilterTable() {
    this.filterTable = {
      soQd: '',
      soBienBan: '',
      ngayBienBan: '',
      diemKho: '',
      nhaKho: '',
      nganKho: '',
      loKho: '',
      trangThaiDuyet: '',
    };
  }

  print() {}
}
