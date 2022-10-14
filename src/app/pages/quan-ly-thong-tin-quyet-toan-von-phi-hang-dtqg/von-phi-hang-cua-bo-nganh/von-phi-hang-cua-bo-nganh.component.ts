import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {MESSAGE} from "../../../constants/message";
import { cloneDeep } from 'lodash';
import {NgxSpinnerService} from "ngx-spinner";
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";
import * as dayjs from "dayjs";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {QuyetToanVonPhiService} from "../../../services/ke-hoach/von-phi/quyetToanVonPhi.service";

@Component({
  selector: 'app-von-phi-hang-cua-bo-nganh',
  templateUrl: './von-phi-hang-cua-bo-nganh.component.html',
  styleUrls: ['./von-phi-hang-cua-bo-nganh.component.scss']
})
export class VonPhiHangCuaBoNganhComponent implements OnInit {
  formData: FormGroup;
  dataTable: any[] = [];
  page: number = 1;
  dsNam: string[] = [];
  dataTableAll: any[] = [];
  allChecked = false;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  pageSize: number = PAGE_SIZE_DEFAULT;
  indeterminate = false;
  filterTable: any = {
    namQuyetToan: '',
    ngayNhap: '',
    ngayCapNhat: '',
    qdCtKhNam: '',
    trangThai: '',
    trangThaiPdBtc: '',
  };
  constructor(
    private readonly fb: FormBuilder,
    private notification: NzNotificationService,
    public globals: Globals,
    private vonPhiService:QuyetToanVonPhiService,
    private spinner: NgxSpinnerService,
    public userService: UserService
  ) {
    this.formData = this.fb.group({
      namQuyetToan: [null],
      ngayCapNhap: [[]],
      ngayNhap: [[]],

    });
  }
  ngOnInit() {
    this.loadDsNam();
  }

  clearFilter() {
    this.formData.reset();
    this.search();
  }
  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear + i).toString());
    }
  }
  async search() {
    this.spinner.show();
    let body = this.formData.value;
    if (body.ngayNhap != null) {
      body.ngayNhapTu = body.ngayNhap[0];
      body.ngayNhapDen = body.ngayNhap[1];
    }
    if (body.ngayCapNhat != null) {
      body.ngayCapNhatTu = body.ngayCapNhat[0];
      body.ngayCapNhatDen = body.ngayCapNhat[1];
    }
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    }
    let res = await this.vonPhiService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
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
}
