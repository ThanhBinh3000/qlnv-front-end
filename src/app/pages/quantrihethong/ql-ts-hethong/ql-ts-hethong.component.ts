import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { Subject } from 'rxjs';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { ThemQlTSHethongComponent } from './them-ql-ts-hethong/them-ql-ts-hethong.component';
import { QlTShethongService } from 'src/app/services/quantri-nguoidung/qlTshethong.service';
import { ActionItem } from 'src/app/constants/form-schema';


@Component({
  selector: 'app-ql-ts-hethong',
  templateUrl: './ql-ts-hethong.component.html',
  styleUrls: ['./ql-ts-hethong.component.scss'],
})
export class QlThamSoHeThongComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  [x: string]: any;
  searchValue = '';
  searchFilter = {
    soDxuat: '',
    trichYeu: '',
  };
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  isVisibleChangeTab$ = new Subject();
  listAction: ActionItem[];
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhSachDauThauService: DanhSachDauThauService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private _modalService: NzModalService,
    private _qlTShethongService: QlTShethongService
  ) {
    this.initAction();
  }
  initAction() {
    this.listAction = [
      new ActionItem({
        class: 'fa fa-pencil-square-o sua',
        name: 'Sửa',
        code: 'sua',
        onClick: (e, data) => {
          e.preventDefault();
          e.stopPropagation();
          this.redirectToThemSua(data);
        },
        visible: false,
        onVisible: (data) => {
          return true
        },
        allowRouter: []
      }),
    ]
  }

  async ngOnInit() {
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
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.search();
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

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }



  clearFilter() {
    this.searchFilter = {
      soDxuat: '',
      trichYeu: '',
    };
    this.startValue = null;
    this.endValue = null;
    this.inputDonVi = '';
    this.search();
  }

  async search() {
    let maDonVi = null;
    if (this.inputDonVi && this.inputDonVi.length > 0) {
      let getDonVi = this.optionsDonVi.filter(
        (x) => x.labelDonVi == this.inputDonVi,
      );
      if (getDonVi && getDonVi.length > 0) {
        maDonVi = getDonVi[0].maDvi;
      }
    }
    let body = {
      "param": null,
      "paramId": null,
      "status": null,
      "str": null,
      "trangThai": null
    };
    let res = await this._qlTShethongService.findList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
          this.danhSachDauThauService
            .deleteKeHoachLCNT({ id: item.id })
            .then((res) => {
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

  redirectToChiTiet(data?: any, detail?) {
    let modal = this._modalService.create({
      nzTitle:
        'Chi tiết tham số hệ thông',
      nzContent: ThemQlTSHethongComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 600,
      nzComponentParams: { data, detail },
    });
    modal.afterClose.subscribe((b) => {
      if (b) {
      }
    });


  }

  redirectToThemSua(data?) {
    let modal = this._modalService.create({
      nzTitle: data
        ? 'Cập nhập tham số hệ thông'
        : 'Thêm mới tham số hệ thông',
      nzContent: ThemQlTSHethongComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 900,
      nzComponentParams: { data },
    });
    modal.afterClose.subscribe((b) => {
      if (b) {
        this.search()
      }
    });

  }

}
