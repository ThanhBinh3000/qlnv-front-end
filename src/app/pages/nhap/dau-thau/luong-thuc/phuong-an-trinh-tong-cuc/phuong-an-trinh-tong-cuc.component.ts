import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { PhuongAnKeHoachLCNTService } from 'src/app/services/phuongAnKeHoachLCNT.service';

@Component({
  selector: 'phuong-an-trinh-tong-cuc',
  templateUrl: './phuong-an-trinh-tong-cuc.component.html',
  styleUrls: ['./phuong-an-trinh-tong-cuc.component.scss'],
})
export class PhuongAnTrinhTongCucComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listNam: any[] = [];
  yearNow: number = 0;
  namKeHoach: number = 0;
  loaiVTHH: number = 0;

  thocIdDefault: number = 2;
  gaoIdDefault: number = 6;
  muoiIdDefault: number = 78;

  dataTable: any[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private phuongAnKeHoachLCNTService: PhuongAnKeHoachLCNTService,
    private modal: NzModalService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearFilter() {
    this.namKeHoach = null;
    this.loaiVTHH = null;
    this.startValue = null;
    this.endValue = null;
  }

  async search() {
    this.dataTable = [];
    let param = {
      "denNgayTao": this.endValue
        ? dayjs(this.endValue).format('DD/MM/YYYY')
        : null,
      "loaiVthh": "00",
      "namKhoach": this.namKeHoach,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page
      },
      "str": "",
      "trangThai": "",
      "tuNgayTao": this.startValue
        ? dayjs(this.startValue).format('DD/MM/YYYY')
        : null,
    }
    this.totalRecord = 0;
    let res = await this.phuongAnKeHoachLCNTService.timKiem(param);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.dataTable = data.content;
      }
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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

  redirectToChiTiet(id: number) {
    this.router.navigate([
      '/nhap/dau-thau/phuong-an-trinh-tong-cuc/thong-tin-chung-phuong-an-trinh-tong-cuc',
      id,
    ]);
  }

  convertTrangThai(status: string) {
    if (status == '01') {
      return "Đã duyệt";
    }
    else {
      return "Chưa duyệt";
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
          this.phuongAnKeHoachLCNTService.deleteData(item.id).then(async () => {
            await this.search();
            this.spinner.hide();
          });
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
}
