import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { DieuChinhQuyetDinhPdKhlcntService } from 'src/app/services/qlnv-hang/nhap-hang/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-dieuchinh-luachon-nhathau',
  templateUrl: './dieuchinh-luachon-nhathau.component.html',
  styleUrls: ['./dieuchinh-luachon-nhathau.component.scss']
})
export class DieuchinhLuachonNhathauComponent implements OnInit {
  @Input() typeVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  listNam: any[] = [];
  searchFilter = {
    soQdinh: '',
    namKh: dayjs().get('year'),
    ngayQd: '',
    loaiVthh: '',
    trichYeu: ''
  };

  allChecked = false;
  indeterminate = false;

  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService: DanhSachDauThauService,
    private modal: NzModalService,
    public userService: UserService,
    private dieuChinhQuyetDinhPdKhlcntService: DieuChinhQuyetDinhPdKhlcntService
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
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

  async search() {
    let body = {
      tuNgayTao: this.searchFilter.ngayQd
        ? dayjs(this.searchFilter.ngayQd[0]).format('YYYY-MM-DD')
        : null,
      denNgayTao: this.searchFilter.ngayQd
        ? dayjs(this.searchFilter.ngayQd[1]).format('YYYY-MM-DD')
        : null,
      soQdinh: this.searchFilter.soQdinh,
      loaiVthh: this.searchFilter.loaiVthh,
      namKhoach: this.searchFilter.namKh,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.dieuChinhQuyetDinhPdKhlcntService.search(body);
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

  searchDanhSachDauThau(body, trangThai) {
    body.trangThai = trangThai
    return this.danhSachDauThauService.search(body);
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

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == '00') {
            item.checked = true;
          }
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

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  async showList() {
    this.isDetail = false;
    await this.search()
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
          this.tongHopDeXuatKHLCNTService.delete(body).then(async () => {
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

}
