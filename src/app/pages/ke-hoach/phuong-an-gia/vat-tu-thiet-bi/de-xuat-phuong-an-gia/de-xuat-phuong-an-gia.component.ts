import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { GiaDeXuatGiaService } from 'src/app/services/gia-de-xuat-gia.service';
import { UserService } from 'src/app/services/user.service';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';

@Component({
  selector: 'app-de-xuat-phuong-an-gia',
  templateUrl: './de-xuat-phuong-an-gia.component.html',
  styleUrls: ['./de-xuat-phuong-an-gia.component.scss']
})
export class DeXuatPhuongAnGiaComponent implements OnInit {
  @Output()
  getCount = new EventEmitter<any>();
  isAddNew = false;
  formData: FormGroup;
  toDay = new Date();
  allChecked = false;
  isViewDetail: boolean = false;
  idSelected: number = 0;


  dataTable: any[] = [];
  page: number = 1;
  dataTableAll: any[] = [];
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  pageSize: number = PAGE_SIZE_DEFAULT;
  indeterminate = false;
  dsNam: string[] = [];

  constructor(private readonly fb: FormBuilder,
    private giaDeXuatGiaService: GiaDeXuatGiaService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private modal: NzModalService,) {
    this.formData = this.fb.group({
      soDeXuat: [null],
      ngayKy: [[]],
      trichYeu: [null],
      namKeHoach: [null],
      loaiHangHoa: [null],
      loaiGia: [null],
      trangThai: [null],

    });
  }

  async ngOnInit() {
    this.loadDsNam();
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
    }
  }

  async search() {
    this.spinner.show();
    let body = this.formData.value;
    if (body.ngayKy != null) {
      body.ngayKyTu = body.ngayKy[0];
      body.ngayKyDen = body.ngayKy[1];
    }
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,

    }
    let res = await this.giaDeXuatGiaService.search(body);
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

  clearFilter() {
    this.formData.reset();
    this.search();
  }

  themMoi() {
    this.idSelected = 0;
    this.isViewDetail = false;
    this.isAddNew = true;
  }

  xoa() { }

  exportData() {

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
  viewDetail(id: number, isViewDetail: boolean) {
    this.idSelected = id;
    this.isViewDetail = isViewDetail;
    this.isAddNew = true;
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
  xoaItem(item: any) {

  }
  async onClose() {
    this.isAddNew = false;
    // await this.search()
  }


}
