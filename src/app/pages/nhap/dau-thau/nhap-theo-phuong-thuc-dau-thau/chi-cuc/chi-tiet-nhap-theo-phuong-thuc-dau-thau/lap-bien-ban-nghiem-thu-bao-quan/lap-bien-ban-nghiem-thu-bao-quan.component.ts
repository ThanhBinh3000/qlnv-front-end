import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyNghiemThuKeLotService } from 'src/app/services/quanLyNghiemThuKeLot.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';

@Component({
  selector: 'app-lap-bien-ban-nghiem-thu-bao-quan',
  templateUrl: './lap-bien-ban-nghiem-thu-bao-quan.component.html',
  styleUrls: ['./lap-bien-ban-nghiem-thu-bao-quan.component.scss']
})
export class LapBienBanNghiemThuBaoQuanComponent implements OnInit {
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

  soBB: number = null;
  ngayTongHop: any = null;
  diemKho: string = '';
  nhaKho: string = '';
  nganLo: string = '';

  loaiVthh: string;
  routerVthh: string;

  userInfo: UserLogin;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyNghiemThuKeLotService: QuanLyNghiemThuKeLotService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private router: Router,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.getTitleVthh();
      this.userInfo = this.userService.getUserLogin();
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

  getTitleVthh() {
    if (this.router.url.indexOf("/thoc/")) {
      this.loaiVthh = "01";
      this.routerVthh = 'thoc';
    } else if (this.router.url.indexOf("/gao/")) {
      this.loaiVthh = "00";
      this.routerVthh = 'gao';
    } else if (this.router.url.indexOf("/muoi/")) {
      this.loaiVthh = "02";
      this.routerVthh = 'muoi';
    } else if (this.router.url.indexOf("/vat-tu/")) {
      this.loaiVthh = "03";
      this.routerVthh = 'vat-tu';
    }
  }

  clearFilter() {
    this.inputDonVi = '';
    this.soBB = null;
    this.ngayTongHop = null;
    this.diemKho = '';
    this.nhaKho = '';
    this.nganLo = '';
    this.search();
  }

  async search() {
    let body = {
      "denNgayLap": this.ngayTongHop && this.ngayTongHop.length > 1
        ? dayjs(this.ngayTongHop[1]).format('YYYY-MM-DD')
        : null,
      "loaiVthh": this.loaiVthh,
      "maDvi": this.userInfo.MA_DVI,
      "maNganKho": this.nganLo,
      "orderBy": null,
      "orderDirection": null,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      "soBb": this.soBB,
      "str": null,
      "trangThai": null,
      "tuNgayLap": this.ngayTongHop && this.ngayTongHop.length > 0
        ? dayjs(this.ngayTongHop[0]).format('YYYY-MM-DD')
        : null,
    };
    let res = await this.quanLyNghiemThuKeLotService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.ngayNghiemThu && item.ngayNghiemThu != null) {
            item.ngayNghiemThuShow = dayjs(item.ngayNghiemThu).format('DD/MM/YYYY')
          }
        });
      }
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
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "denNgayLap": this.ngayTongHop && this.ngayTongHop.length > 1
            ? dayjs(this.ngayTongHop[1]).format('YYYY-MM-DD')
            : null,
          "loaiVthh": this.loaiVthh,
          "maDvi": this.userInfo.MA_DVI,
          "maNganKho": this.nganLo,
          "orderBy": null,
          "orderDirection": null,
          "paggingReq": null,
          "soBb": this.soBB,
          "str": null,
          "trangThai": null,
          "tuNgayLap": this.ngayTongHop && this.ngayTongHop.length > 0
            ? dayjs(this.ngayTongHop[0]).format('YYYY-MM-DD')
            : null,
        };
        this.quanLyNghiemThuKeLotService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-nghiem-thu-bao-quan.xlsx'),
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

  redirectToChiTiet(isView: boolean, id: number) {
    if (!isView) {
      let urlChiTiet = this.router.url + '/thong-tin'
      this.router.navigate([urlChiTiet, id,]);
    }
    else {
      let urlChiTiet = this.router.url + '/thong-tin'
      this.router.navigate([urlChiTiet, id,]);
    }
  }
}
