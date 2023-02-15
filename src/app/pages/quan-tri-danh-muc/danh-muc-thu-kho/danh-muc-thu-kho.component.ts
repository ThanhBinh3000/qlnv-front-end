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
  selector: 'app-danh-muc-thu-kho',
  templateUrl: './danh-muc-thu-kho.component.html',
  styleUrls: ['./danh-muc-thu-kho.component.scss']
})
export class DanhMucThuKhoComponent implements OnInit {
  dataTable: any[] = [];
  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  listDviTinh: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  searchFilter = {
    maThuKho : '',
    tenThuKho : '',
    cccd : '',
    trangThai : ''
  };
  listTrangThai = [{"ma": "01", "giaTri": "Hoạt động"}, {"ma": "00", "giaTri": "Không hoạt động"}];
  rowItem : DanhMucThuKho = new DanhMucThuKho();
  dataEdit: { [key: string]: { edit: boolean; data: DanhMucThuKho } } = {};

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

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        }
      });
    }
  }

  async search() {
    this.spinner.show();
    let body = {
      "maThuKho": this.searchFilter.maThuKho,
      "paggingReq": {
        "limit": 10,
        "page": this.page - 1
      },
      "tenThuKho": this.searchFilter.tenThuKho,
      "cccd": this.searchFilter.cccd,
      "trangThai" : this.searchFilter.trangThai
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
    this.updateEditCache()
    this.spinner.hide();
  }
  async themMoiItem(id?, data? : DanhMucThuKho) {
    this.spinner.show();
    if (!this.checkValidators(data)) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng không để trống!!")
      this.spinner.hide();
      return;
    }
    if (id && id > 0) {
      this.rowItem = data
    }
    let body = {
      "id": id? id : null,
      "maThuKho" : this.rowItem.maThuKho,
      "hoTen" : this.rowItem.hoTen,
      "cccd" : this.rowItem.cccd,
      "trangThai" : this.rowItem.trangThai,
      "maDvi": this.userInfo.MA_DVI
    }
    let res;
    if (id && id>0) {
      res = await this.dmThuKho.update(body);
    } else {
      res = await this.dmThuKho.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if(id && id>0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.rowItem = new DanhMucThuKho();
      await this.search();
      this.updateEditCache();
    }
    this.spinner.hide();
  }

  checkValidators(rowItem: DanhMucThuKho) {
    let arr = [];
    let check = true;
    arr.push(
      rowItem.maThuKho, rowItem.hoTen, rowItem.cccd, rowItem.trangThai
    )
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '' || arr[i] == null || arr[i] == undefined) {
          check = false;
          break;
        }
      }
    }
    return check;
  }


  refresh() {
    this.rowItem = new DanhMucThuKho();
  }

  clearFilter() {
    this.searchFilter = {
      maThuKho : '',
      tenThuKho : '',
      cccd : '',
      trangThai : ''
    };
    this.search();
  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: {...this.dataTable[idx]},
      edit: false,
    };
  }

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "maThuKho": this.searchFilter.maThuKho,
          "paggingReq": {
            "limit": 10,
            "page": this.page - 1
          },
          "tenThuKho": this.searchFilter.tenThuKho,
          "cccd": this.searchFilter.cccd,
          "trangThai" : this.searchFilter.trangThai
        }

        this.dmThuKho
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-danh-muc-tai-san.xlsx'),
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
          let body = {
            ids : item.id
          }
          this.dmThuKho.delete(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS,);
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.search();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  startEdit(i: number) {
    this.dataEdit[i].edit = true;
  }
  xoa() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked && item.trangThai == '00') {
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
            let res = await this.dmThuKho.deleteMulti({idList: dataDelete});
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

}

export class DanhMucThuKho {
  id : number;
  maDvi : string;
  maThuKho : string;
  hoTen : string;
  cccd : string;
  trangThai : string;
}
