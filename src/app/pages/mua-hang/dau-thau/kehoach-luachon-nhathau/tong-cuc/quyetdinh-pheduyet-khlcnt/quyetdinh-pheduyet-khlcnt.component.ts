import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DATEPICKER_CONFIG, LEVEL, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai, convertVthhToId } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-quyetdinh-pheduyet-khlcnt',
  templateUrl: './quyetdinh-pheduyet-khlcnt.component.html',
  styleUrls: ['./quyetdinh-pheduyet-khlcnt.component.scss']
})
export class QuyetdinhPheduyetKhlcntComponent implements OnInit {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService : DanhSachDauThauService,
    private modal: NzModalService,
    private userService: UserService,
    private route: ActivatedRoute,
    private helperService: HelperService
  ) { 
    router.events.subscribe((val)=>{
      this.getTitleVthh();
  })}
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;

  searchFilter = {
    soQdinh: '',
    namKh: dayjs().get('year'),
    ngayTongHop: '',
    loaiVthh: ''
  };

  dataTable: any[] = [];
  page: number = 0;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  lastBreadcrumb: string;
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;



  async ngOnInit() {
    this.spinner.show();
    try {
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

  getTitleVthh(){
    let loatVthh = this.router.url.split('/')[4]
    this.searchFilter.loaiVthh = convertVthhToId(loatVthh);
  }

  async search() {
    let body = {
      tuNgayTao: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
        : null,
      denNgayTao: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
        : null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page,
      },
      soQdinh: this.searchFilter.soQdinh,
      loaiVthh: this.searchFilter.loaiVthh,
      namKhoach : this.searchFilter.namKh
    };
    let res = null;
    if (this.tabSelected == 'phuong-an-tong-hop') {
      res = await this.tongHopDeXuatKHLCNTService.search(body);
    }else if(this.tabSelected == 'danh-sach-tong-hop'){
      // Trạng thái đã tổng hợp
      res = await this.searchDanhSachDauThau(body,"05")
    }else {
      // Trạng thái chưa tổng hợp
      res = await this.searchDanhSachDauThau(body,"10")
    }
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  searchDanhSachDauThau(body,trangThai){
    body.trangThai = trangThai
    return this.danhSachDauThauService.search(body);
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

  redirectToChiTiet(id) {
    if (this.router.url.includes(LEVEL.TONG_CUC)) {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc',
        id,
      ]);
    } else if (this.router.url.includes(LEVEL.CUC)) {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-cuc',
        id,
      ]);
    }
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
    // if (this.totalRecord > 0) {
    //   this.spinner.show();
    //   try {
    //     let body = {
    //       // "denNgayTao": this.endValue
    //       //   ? dayjs(this.endValue).format('YYYY-MM-DD')
    //       //   : null,
    //       // "loaiVthh": this.searchFilter.loaiVthh,
    //       // "namKhoach": this.searchFilter.namKh,
    //       // "paggingReq": null,
    //       // "str": "",
    //       // "trangThai": "",
    //       // "tuNgayTao": this.startValue
    //       //   ? dayjs(this.startValue).format('YYYY-MM-DD')
    //       //   : null,
    //     };
    //     this.tongHopDeXuatKHLCNTService
    //       .exportList(body)
    //       .subscribe((blob) =>
    //         saveAs(blob, 'danh-sach-tong-hop-ke-hoach-lcnt.xlsx'),
    //       );
    //     this.spinner.hide();
    //   } catch (e) {
    //     console.log('error: ', e);
    //     this.spinner.hide();
    //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //   }
    // } else {
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    // }
  }

  dateChange() {
    this.helperService.formatDate()
  }

  themMoi() {
    let loatVthh = this.router.url.split('/')[4]
    this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/'+loatVthh+'/phe-duyet/them-moi']);
  }
}
