import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemDanhMucDungChungComponent } from 'src/app/components/dialog/dialog-them-danh-muc-dung-chung/dialog-them-danh-muc-dung-chung.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { DanhMucDungChungService } from "../../../services/danh-muc-dung-chung.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
  selector: 'app-danh-muc-dung-chung',
  templateUrl: './danh-muc-dung-chung.component.html',
  styleUrls: ['./danh-muc-dung-chung.component.scss'],
})
export class DanhMucDungChungComponent implements OnInit {
  @Input() typeVthh: string;

  qdTCDT: string = MESSAGE.QD_TCDT;

  formData: FormGroup;

  danhMucList: any[];

  setOfCheckedId = new Set<number>();


  searchFilter = {
    ma: '',
    maCha: '',
    giaTri: '',
    ghiChu: '',
    loai: ''
  };

  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;

  page: number = 1;
  pageSize: number = 20;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    loai: '',
    ma: '',
    giaTri: '',
    trangThai: '',
    nguoiTao: '',
    ngayTao: '',
    nguoiSua: '',
    ngaySua: '',
  };


  constructor(
    private readonly fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dmDungChungService: DanhMucDungChungService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private router: Router
  ) {
    this.formData = this.fb.group({
      ma: [null],
      maCha: [null],
      giaTri: [null],
      ghiChu: [null],
      loai: [null]
    });
  }

  async ngOnInit() {
    try {
      if (!this.userService.isAccessPermisson('QTDM_DM_DUNG_CHUNG')) {
        this.router.navigateByUrl('/error/401')
      }
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      await this.search();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  onAllChecked(checked) {
    this.dataTable.forEach((item) => {
      this.updateCheckedSet(item.id, checked);
    })
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
    console.log(this.setOfCheckedId
    )
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

  async search() {
    this.spinner.show();
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    }
    let res = await this.dmDungChungService.search(body);
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
    this.formData.reset()
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
          this.dmDungChungService.xoa(item.id).then((res) => {
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
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
            let res = await this.dmDungChungService.deleteMuti({ ids: dataDelete });
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
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  filterInTable(key: string, value: string) {
    this.search();

    //   if (value && value != '') {
    //     this.dataTable = [];
    //     let temp = [];
    //     if (this.dataTableAll && this.dataTableAll.length > 0) {
    //       this.dataTableAll.forEach((item) => {
    //         if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
    //           temp.push(item)
    //         }
    //       });
    //     }
    //     this.dataTable = [...this.dataTable, ...temp];
    //   } else {
    //     this.dataTable = cloneDeep(this.dataTableAll);
    //   }
    //   console.log(this.dataTableAll)
    // }
  }

  print() {

  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        this.dmDungChungService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-danh-muc-dung-chung.xlsx'),
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

  them(data?: any, isView?: boolean) {
    let modalTuChoi = this.modal.create({
      nzTitle: "Thông tin danh mục dùng chung",
      nzContent: DialogThemDanhMucDungChungComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1000px',
      nzFooter: null,
      nzClassName: 'themdmdungchung',
      nzComponentParams: {
        dataEdit: data,
        isView: isView,
      },
    });
    modalTuChoi.afterClose.subscribe((data) => {
      this.search();
    })
  }

  xoaNhieu() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.setOfCheckedId.forEach((item) => {
        dataDelete.push(item);
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
            let res = await this.dmDungChungService.deleteMuti({ idList: dataDelete });
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



