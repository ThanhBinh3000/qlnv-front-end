import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBienBanLayMauService } from 'src/app/services/quanLyBienBanLayMau.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';

@Component({
  selector: 'quan-ly-bien-ban-lay-mau',
  templateUrl: './quan-ly-bien-ban-lay-mau.component.html',
  styleUrls: ['./quan-ly-bien-ban-lay-mau.component.scss'],
})
export class QuanLyBienBanLayMauComponent implements OnInit {
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  searchFilter = {
    ngayLayMau: '',
    soHopDong: '',
    diemkho: '',
    nhaKho: '',
    nganLoBaoQuan: '',
    soBiebBan: ''
  };
  routerUrl: string;

  diemKho: string = '';
  nhaKho: string = '';
  nganLo: string = '';

  loaiVthh: string;
  routerVthh: string;

  userInfo: UserLogin;

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganLo: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private bienBanLayMauService: QuanLyBienBanLayMauService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,

  ) { }

  async ngOnInit() {
    this.routerUrl = this.router.url;
    this.spinner.show();
    try {
      let res = await this.donViService.layTatCaDonVi();
      await Promise.all([
        this.loadDiemKho(),
        // this.loadNhaKho(null),
        this.loadNganLo(),
        this.search(),
      ]);
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
      ngayLayMau: this.searchFilter.ngayLayMau ?? null,
      soHopDong: this.searchFilter.soHopDong ?? null,
      diemkho: this.searchFilter.diemkho ?? null,
      nhaKho: this.searchFilter.nhaKho ?? null,
      nganLoBaoQuan: this.searchFilter.nganLoBaoQuan ?? null,
      soBiebBan: this.searchFilter.soBiebBan ?? null,
      ngayLapBbanTuNgay: this.searchFilter.ngayLayMau ? dayjs(this.searchFilter.ngayLayMau[0]).format('YYYY/MM/DD')
        : null,
      ngayLapBbanDenNgay: this.searchFilter.ngayLayMau ? dayjs(this.searchFilter.ngayLayMau[1]).format('YYYY/MM/DD')
        : null,
      pageNumber: this.page,
      pageSize: this.pageSize,
    };
    console.log(body);

    let res = await this.bienBanLayMauService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
    } else {
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
      if (this.page === 1) {
        await this.search();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  clearFilter() {
    this.searchFilter = {
      ngayLayMau: '',
      soHopDong: '',
      diemkho: '',
      nhaKho: '',
      nganLoBaoQuan: '',
      soBiebBan: ''
    };
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
          this.bienBanLayMauService.xoa(item.id).then((res) => {
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
    if (!isView) {
      let urlChiTiet = this.router.url + '/thong-tin'
      this.router.navigate([urlChiTiet, id]);
    }
    else {
      let urlChiTiet = this.router.url + '/thong-tin'
      this.router.navigate([urlChiTiet, id]);
    }
  }
  async loadDiemKho() {
    let res = await this.tinhTrangKhoHienThoiService.getAllDiemKho();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listDiemKho = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadNhaKho(diemKhoId: any) {
    let body = {
      "diemKhoId": diemKhoId,
      "maNhaKho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNhaKho": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nhaKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNhaKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeDiemKho() {
    let diemKho = this.listDiemKho.filter(x => x.maDiemkho == this.diemKho);
    this.nhaKho = null;
    if (diemKho && diemKho.length > 0) {
      await this.loadNhaKho(diemKho[0].id);
    }
  }

  async loadNganLo() {
    let body = {
      "maNganLo": null,
      "nganKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganLo": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganLoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganLo = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
}
