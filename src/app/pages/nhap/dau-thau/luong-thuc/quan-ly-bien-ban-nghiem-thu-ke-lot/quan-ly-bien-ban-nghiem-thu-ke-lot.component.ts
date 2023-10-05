import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyNghiemThuKeLotService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'quan-ly-bien-ban-nghiem-thu-ke-lot',
  templateUrl: './quan-ly-bien-ban-nghiem-thu-ke-lot.component.html',
  styleUrls: ['./quan-ly-bien-ban-nghiem-thu-ke-lot.component.scss'],
})
export class QuanLyBienBanNghiemThuKeLotComponent implements OnInit {
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];

  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  loaiVTHH: string = null;
  soBB: number = null;
  maNganKho: string = null;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyNghiemThuKeLotService: QuanLyNghiemThuKeLotService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private router: Router,
  ) { }

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

  clearFilter() {
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
      "denNgayLap": this.endValue
        ? dayjs(this.endValue).format('YYYY-MM-DD')
        : null,
      "loaiVthh": this.loaiVTHH ?? "00",
      "maDvi": maDonVi,
      "maNganKho": this.maNganKho,
      "orderBy": null,
      "orderDirection": null,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page
      },
      "soBb": this.soBB,
      "str": null,
      "trangThai": null,
      "tuNgayLap": this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
    };
    let res = await this.quanLyNghiemThuKeLotService.timKiem(body);
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
          this.quanLyNghiemThuKeLotService
            .xoa({ id: item.id })
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

  pheDuyet(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.quanLyNghiemThuKeLotService
            .xoa({ id: item.id })
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

  }

  redirectToChiTiet(id: number) {
    this.router.navigate([
      'nhap/dau-thau/quan-ly-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot/',
      id,
    ]);
  }
}
