import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { cloneDeep } from 'lodash';
import { QuyetDinhTtcpService } from 'src/app/services/quyetDinhTtcp.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-ttcp',
  templateUrl: './ttcp.component.html',
  styleUrls: ['./ttcp.component.scss'],
})
export class TtcpComponent implements OnInit {
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
    soQd: '',
    namQd: dayjs().get('year'),
    ngayQd: '',
    trichYeu: '',
  };
  filterTable: any = {
    soQd: '',
    nam: '',
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
    private quyetDinhTtcpService: QuyetDinhTtcpService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
  ) {
    this.formData = this.fb.group({
      namQd: [null],
      soQd: [null],
      ngayQd: [[]],
      trichYeu: [null],
    });
  }

  async ngOnInit() {
    this.loadDsNam();
    this.search();
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
    let res = await this.quyetDinhTtcpService.search(body);
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
        this.quyetDinhTtcpService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-thu-tuong-chinh-phu.xlsx'),
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
      nam: '',
      ngayQd: '',
      trichYeu: '',
      taiLieuDinhKem: '',
      trangThai: '',
    }
  }
}

// interface IQuyetDinhTTCP {
//   id: number;
//   soQd: string;
//   namQd: string;
//   ngayQd: Date;
//   trichYeu: string;
//   taiLieuDinhKem: any;
//   trangThai: string;
// }
