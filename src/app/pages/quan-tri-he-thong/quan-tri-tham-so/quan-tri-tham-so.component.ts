import {Component, EventEmitter, OnInit} from '@angular/core';
import {saveAs} from 'file-saver';
import { FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {HelperService} from 'src/app/services/helper.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {DanhMucService} from "../../../services/danhmuc.service";
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";
import {UserLogin} from "../../../models/userlogin";
import {cloneDeep} from 'lodash';
import {DanhMucTaiSanService} from "../../../services/danh-muc-tai-san.service";
import {UserService} from "../../../services/user.service";
import {DanhMucThuKhoService} from "../../../services/danh-muc-thu-kho.service";


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
  listDviTinh: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;

  constructor(
    private router: Router,
    private userService : UserService,
    private dmThuKho: DanhMucThuKhoService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
  ) {
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
    }
    let res = await this.dmThuKho.search(body);
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
}
