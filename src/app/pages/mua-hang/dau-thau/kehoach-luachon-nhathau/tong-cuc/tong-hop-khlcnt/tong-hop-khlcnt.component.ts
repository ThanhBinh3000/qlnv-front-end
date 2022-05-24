import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { DATEPICKER_CONFIG, LEVEL, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { convertTrangThai, convertVthhToId } from 'src/app/shared/commonFunction';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder } from '@angular/forms';
import { PhuongAnKeHoachLCNTService } from 'src/app/services/phuongAnKeHoachLCNT.service';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';

@Component({
  selector: 'app-tong-hop-khlcnt',
  templateUrl: './tong-hop-khlcnt.component.html',
  styleUrls: ['./tong-hop-khlcnt.component.scss']
})
export class TongHopKhlcntComponent implements OnInit {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService: DanhSachDauThauService,
    private modal: NzModalService,
    private userService: UserService,
    private route: ActivatedRoute,
    private helperService: HelperService
  ) {
    router.events.subscribe((val) => {
      this.getTitleVthh();
    })
    this.danhMucDonVi = JSON.parse(sessionStorage.getItem('danhMucDonVi'));
  }
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  danhMucDonVi: any;

  searchFilter = {
    soQdinh: '',
    namKh: dayjs().get('year'),
    ngayTongHop: '',
    loaiVthh: ''
  };

  dataTable: any[] = [];
  dataTableDanhSachDX: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  lastBreadcrumb: string;
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;
  listVthh: any[] = [];


  async ngOnInit() {
    this.spinner.show();
    try {
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.userInfo = this.userService.getUserLogin();
      this.getTitleVthh();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  getTitleVthh() {
    let loatVthh = this.router.url.split('/')[4]
    this.searchFilter.loaiVthh = convertVthhToId(loatVthh);
  }

  async search() {
    this.spinner.show();
    let body = {
      tuNgayTao: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
        : null,
      denNgayTao: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
        : null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      soQdinh: this.searchFilter.soQdinh,
      loaiVthh: this.searchFilter.loaiVthh,
      namKhoach: this.searchFilter.namKh
    };
    let res = null;
    if (this.tabSelected == 'phuong-an-tong-hop') {
      res = await this.tongHopDeXuatKHLCNTService.search(body);
    } else if (this.tabSelected == 'danh-sach-tong-hop') {
      // Trạng thái đã tổng hợp
      res = await this.searchDanhSachDauThau(body, "05")
    } else {
      // Trạng thái chưa tổng hợp
      res = await this.searchDanhSachDauThau(body, "11")
    }
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (this.tabSelected == 'phuong-an-tong-hop') {
        this.dataTable = data.content;
      } else {
        this.dataTableDanhSachDX = data.content;
      }
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async searchDanhSachDauThau(body, trangThai) {
    body.trangThai = trangThai
    return await this.danhSachDauThauService.search(body);
  }

  async selectTabData(tab: string) {
    this.spinner.show();
    try {
      this.tabSelected = tab;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  themMoi() {
    let loatVthh = this.router.url.split('/')[4]
    this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + loatVthh + '/tong-hop/them-moi']);
  }

  redirectToChiTiet(id?) {

  }

  calendarData(list, column) {
    let tongSL = 0;
    let tongTien = 0;
    if (list.length > 0) {
      // console.log(list);
      list.forEach(function (value) {
        tongSL += value.soLuong;
        tongTien += value.thanhTien;
      })
      return column == 'tong-tien' ? tongTien : tongSL;
    }
    return tongSL;
  }

  calendarTongTien(list) {
    if (list.length > 0) {
      console.log(list);
    }
    return 0;
  }

  getTenDviTable(maDvi: string) {
    let donVi = this.danhMucDonVi?.filter(item => item.maDvi == maDvi);
    return donVi.length > 0 ? donVi[0].tenDvi : null
  }

  clearFilter() {
    // this.namKeHoach = null;
    // this.loaiVthh = null;
    // this.startValue = null;
    // this.endValue = null;
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
            "id": item.id,
            "maDvi": ""
          }
          this.tongHopDeXuatKHLCNTService.xoa(body).then(async () => {
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

  convertDay(day: string) {
    if (day && day.length > 0) {
      return dayjs(day).format('DD/MM/YYYY');
    }
    return '';
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          // "denNgayTao": this.endValue
          //   ? dayjs(this.endValue).format('YYYY-MM-DD')
          //   : null,
          // "loaiVthh": this.searchFilter.loaiVthh,
          // "namKhoach": this.searchFilter.namKh,
          // "paggingReq": null,
          // "str": "",
          // "trangThai": "",
          // "tuNgayTao": this.startValue
          //   ? dayjs(this.startValue).format('YYYY-MM-DD')
          //   : null,
        };
        this.tongHopDeXuatKHLCNTService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-tong-hop-ke-hoach-lcnt.xlsx'),
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

  dateChange() {
    this.helperService.formatDate()
  }

}
