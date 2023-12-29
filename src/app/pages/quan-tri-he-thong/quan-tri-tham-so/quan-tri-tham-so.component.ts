import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {HelperService} from 'src/app/services/helper.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";
import {UserLogin} from "../../../models/userlogin";
import {cloneDeep} from 'lodash';
import {UserService} from "../../../services/user.service";
import {QuanTriThamSoService} from "../../../services/quan-tri-tham-so.service";
import {ThemMoiQtriThamSoComponent} from "./them-moi-qtri-tham-so/them-moi-qtri-tham-so.component";
import {saveAs} from "file-saver";


@Component({
  selector: 'app-quan-tri-tham-so',
  templateUrl: './quan-tri-tham-so.component.html',
  styleUrls: ['./quan-tri-tham-so.component.scss']
})
export class QuanTriThamSoComponent implements OnInit {
  dataTable: any[] = [];
  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;

  constructor(
    private router: Router,
    private userService: UserService,
    private serVice: QuanTriThamSoService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
  ) {
  }

  filterTable = {
    ma: '',
    ten: '',
    giaTri: '',
    moTa: '',
    tuNgay: '',
    denNgay: '',
    tenTrangThai: '',
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search() {
    this.spinner.show();
    let body = {
      "paggingReq": {
        "limit": 10,
        "page": this.page - 1
      }
    }
    let res = await this.serVice.search(body);
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
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
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
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  themMoi(data?: any) {
    let modalQD = this.modal.create({
      nzTitle: data ? 'CẬP NHẬT QUẢN TRỊ THAM SỐ' : 'THÊM MỚI QUẢN TRỊ THAM SỐ',
      nzContent: ThemMoiQtriThamSoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataDetail: data
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      await this.search()
    })
  }

  xuatExcel() {
    this.spinner.show();
    try {
      let body = {
        "paggingReq": {
          "limit": 10,
          "page": this.page - 1
        }
      }
      this.serVice.export(body)
        .subscribe((blob) =>
          saveAs(blob, 'tham-so.xlsx'),
        );
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
