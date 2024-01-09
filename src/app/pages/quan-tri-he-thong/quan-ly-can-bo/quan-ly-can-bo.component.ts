import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogPhanQuyenComponent } from 'src/app/components/dialog/dialog-phan-quyen/dialog-phan-quyen.component';
import {
  DialogThongTinCanBoComponent
} from 'src/app/components/dialog/dialog-thong-tin-can-bo/dialog-thong-tin-can-bo.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { QlNguoiSuDungService } from 'src/app/services/quantri-nguoidung/qlNguoiSuDung.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { DanhMucDungChungService } from "../../../services/danh-muc-dung-chung.service";

@Component({
  selector: 'app-quan-ly-can-bo',
  templateUrl: './quan-ly-can-bo.component.html',
  styleUrls: ['./quan-ly-can-bo.component.scss'],
})
export class QuanLyCanBoComponent implements OnInit {
  @Input() typeVthh: string;

  qdTCDT: string = MESSAGE.QD_TCDT;

  formData: FormGroup;

  data: any;

  danhMucList: any[];

  setOfCheckedId = new Set<number>();


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

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  constructor(
    private readonly fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dmDungCungService: DanhMucDungChungService,
    private qlNsdService: QlNguoiSuDungService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private router: Router,
    private donViService: DonviService
  ) {
    this.formData = this.fb.group({
      userType: ['ALL']
    });
  }

  async ngOnInit() {
    try {
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

  async search(userType?) {
    this.spinner.show();
    let body = this.formData.value;
    if (!userType) {
      body.userType = 'ALL'
    } else {
      body.userType = userType;
    }
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    }
    let res = await this.qlNsdService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
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
          this.qlNsdService.delete({ id: item.id }).then((res) => {
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
            let res = await this.dmDungCungService.deleteMuti({ ids: dataDelete });
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

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        this.qlNsdService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-can-bo.xlsx'),
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
    let modal = this.modal.create({
      nzTitle: data ? 'THÔNG TIN NGƯỜI SỬ DỤNG' : 'THÊM MỚI THÔNG TIN NGƯỜI SỬ DỤNG',
      nzContent: DialogThongTinCanBoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        isView: isView,
        isOld: false
      },
    });
    modal.afterClose.subscribe((data) => {
      this.search();
    })
  }

  async laytatcadonvi() {
    this.spinner.show();
    try {
      let res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          var item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
          // nếu dữ liệu detail có
          if (this.data) {
            if (res.data[i].maDvi == this.data.dvql) {
              this.data.dvql = res.data[i].maDvi + ' - ' + res.data[i].tenDvi
              // this.initForm()
            }
          }
        }

      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  openPhanQuyen(data) {
    let modalPhanQuyen;
    modalPhanQuyen = this.modal.create({
      nzTitle: 'Phân quyền',
      nzContent: DialogPhanQuyenComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1300px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data
      },
    });
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
            let res = await this.dmDungCungService.deleteMuti({ idList: dataDelete });
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



