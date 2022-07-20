import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { QuyetDinhBtcTcdtService } from 'src/app/services/quyetDinhBtcTcdt.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/constants/message';
import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-btc-giao-tcdt',
  templateUrl: './btc-giao-tcdt.component.html',
  styleUrls: ['./btc-giao-tcdt.component.scss'],
})
export class BtcGiaoTcdtComponent implements OnInit {
  isAddNew = false;
  formData: FormGroup;
  toDay = new Date();
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  allChecked = false;
  indeterminate = false;

  dsNam: string[] = [];
  searchInTable: any = {
    soQd: null,
    namQd: null,
    ngayQd: new Date(),
    trichYeu: null,
  };
  filterTable: any = {
    soQd: '',
    ngayQd: '',
    trichYeu: '',
    taiLieuDinhKem: '',
    trangThai: '',
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  constructor(private readonly fb: FormBuilder,
    private quyetDinhBtcTcdtService: QuyetDinhBtcTcdtService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
  ) {
    this.formData = this.fb.group({
      namQd: [null],
      soQd: [null],
      ngayQd: [this.last30Day, this.toDay],
      trichYeu: [null],
    });
  }

  ngOnInit(): void {
    this.loadDsNam();
    this.search();
    // this.dataTable = [...this.dataExample];
  }

  initForm(): void {

  }

  initData() {

  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
    }
  }

  clearFilter() {
    this.formData.reset();
  }

  async search() {
    this.spinner.show();
    let body = this.formData.value;
    body.tuNgay = body.ngayQd[0];
    body.denNgay = body.ngayQd[1];
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,

    }
    let res = await this.quyetDinhBtcTcdtService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
          // item.statusConvert = this.convertTrangThai(item.trangThai);
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);

    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }


  xoa() { }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.tuNgay = body.ngayQd[0];
        body.denNgay = body.ngayQd[1];
        this.quyetDinhBtcTcdtService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-bo-tai-chinh-tong-cuc-du-tru.xlsx'),
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

  themMoi() {
    this.isAddNew = true;
  }

  onAllChecked(checked) {
    this.dataTable.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.allChecked = this.dataTable.every(({ id }) =>
      this.setOfCheckedId.has(id),
    );
    this.indeterminate =
      this.dataTable.some(({ id }) => this.setOfCheckedId.has(id)) &&
      !this.allChecked;
  }

  onItemChecked(id: number, checked) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onClose() {
    this.isAddNew = false;
  }

  changePageIndex(event) { }

  changePageSize(event) { }

  viewDetail(id: number, isViewDetail: boolean) { }

  xoaItem(id: number) { }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
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
      soQd: '',
      ngayQd: '',
      trichYeu: '',
      taiLieuDinhKem: '',
      trangThai: '',
    }
  }
}


// interface IBTCGiaoTCDT {
//   id: number;
//   soQd: string;
//   ngayQd: Date;
//   trichYeu: string;
//   taiLieuDinhKem: any;
//   trangThai: string;
// }
