import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { DATEPICKER_CONFIG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { Subject } from 'rxjs';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'danh-sach-dau-thau',
  templateUrl: './danh-sach-dau-thau.component.html',
  styleUrls: ['./danh-sach-dau-thau.component.scss'],
})
export class DanhSachDauThauComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  searchValue = '';
  searchFilter = {
    soQdinh: '',
    nDung: '',
    ngayQdinh: '',
    namNhap: ''
  };
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];
  errorMessage: string = '';
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  isVisibleChangeTab$ = new Subject();
  datePickerConfig = DATEPICKER_CONFIG;
  type: string = '';
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhSachDauThauService: DanhSachDauThauService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private helperService: HelperService
  ) {}

  async ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
    this.spinner.show();
    try {
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number) {
    this.router.navigate([
      `/nhap/dau-thau/them-moi-quyet-dinh-nhap-xuat-hang/${this.type}`,
      id,
    ]);
  }

  dateChange() {
    this.helperService.formatDate()
  }

  clearFilter() {
    this.searchFilter = {
      soQdinh: '',
      nDung: '',
      ngayQdinh: '',
      namNhap: ''
    };
    this.search();
  }

  async search() {
    let body = {
      ngayQdinh: this.searchFilter.ngayQdinh
        ? dayjs(this.searchFilter.ngayQdinh).format('YYYY-MM-DD')
        : null,
      id: 0,
      paggingReq: {
        limit: this.pageSize,
        page: this.page,
      },
      soQdinh: this.searchFilter.soQdinh,
      nDung: this.searchFilter.nDung,
    };
    let res = await this.danhSachDauThauService.timKiem(body);
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

  export() {
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
      id: 0,
      maDvi: maDonVi,
      paggingReq: null,
      soQdinh: this.searchFilter.soQdinh,
      str: null,
      nDung: this.searchFilter.nDung,
    };
    this.danhSachDauThauService.export(body).subscribe((blob) => {
      saveAs(blob, 'Danh sách đề xuất kế hoạch lựa chọn nhà thầu.xlsx');
    });
  }
}
