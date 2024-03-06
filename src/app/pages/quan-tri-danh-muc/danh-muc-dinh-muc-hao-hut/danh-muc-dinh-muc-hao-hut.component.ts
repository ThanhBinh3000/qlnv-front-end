import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";
import {UserLogin} from "../../../models/userlogin";
import {cloneDeep} from 'lodash';
import {UserService} from "../../../services/user.service";
import {DanhMucDinhMucHaoHutService} from "../../../services/danh-muc-dinh-muc-hao-hut.service";
import {Globals} from "../../../shared/globals";
import {AMOUNT} from "../../../Utility/utils";
import {saveAs} from 'file-saver';
import {STATUS} from "../../../constants/status";

@Component({
  selector: 'app-danh-muc-dinh-muc-hao-hut',
  templateUrl: './danh-muc-dinh-muc-hao-hut.component.html',
  styleUrls: ['./danh-muc-dinh-muc-hao-hut.component.scss']
})
export class DanhMucDinhMucHaoHutComponent implements OnInit {
  dataTable: any[] = [];
  isViewDetail: boolean = false;
  isAddNew: boolean = false;
  idSelected: number = 0;
  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  dsCuc: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  searchFilter = {
   soTt: '',
   ngayKyTu: '',
   ngayKyDen: '',
   ngayHlTu: '',
   ngayHlDen: '',
   trangThai: '',
   trichYeu: '',
  };
  STATUS = STATUS;
  listTrangThai: any[] = [
    { ma: STATUS.DANG_NHAP_DU_LIEU, giaTri: 'Đang nhập dữ liệu' },
    { ma: STATUS.BAN_HANH, giaTri: 'Ban hành' },
    { ma: STATUS.HET_HIEU_LUC, giaTri: 'Hết hiệu lực' },
  ];
  amount = AMOUNT;
  constructor(
    private router: Router,
    public userService: UserService,
    private dmDinhMucHaoHut: DanhMucDinhMucHaoHutService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    public globals : Globals
  ) {
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QTDM_DM_DINHMUC_HAOHUT')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
       this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isAddNew = true;
    this.isViewDetail = isView ?? false;
  }



  async search() {
    this.spinner.show();
    let body = {
      "paggingReq": {
        "limit": 10,
        "page": this.page - 1
      },
      "soTt" : this.searchFilter.soTt,
      "trichYeu" : this.searchFilter.trichYeu,
      "ngayKyTu" : this.searchFilter.ngayKyTu,
      "ngayKyDen" : this.searchFilter.ngayKyDen,
      "ngayHlTu" : this.searchFilter.ngayHlTu,
      "ngayHlDen" : this.searchFilter.ngayHlDen,
    }
    let res = await this.dmDinhMucHaoHut.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
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
          item.checked = true;
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

  export() {
        this.spinner.show();
        try {
          let body = {};
          this.dmDinhMucHaoHut
            .export(body)
            .subscribe((blob) =>
              saveAs(blob, 'danh-muc-dm-hao-hut.xlsx'),
            );
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
  }

  async clearFilter() {
    this.searchFilter = {
      soTt: '',
      ngayKyTu: '',
      ngayKyDen: '',
      ngayHlTu: '',
      ngayHlDen: '',
      trangThai: '',
      trichYeu: '',
    };
    await this.search();
  }

  viewDetail(id: number, isViewDetail: boolean) {
    this.idSelected = id;
    this.isViewDetail = isViewDetail;
    this.isAddNew = true;
  }

  delete(data: any) {

  }

  async showList() {
    this.isAddNew = false;
    await this.search();
  }
}
