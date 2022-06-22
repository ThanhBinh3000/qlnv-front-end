import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DATEPICKER_CONFIG, LEVEL, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai, convertVthhToId } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-danhsach-kehoach-lcnt',
  templateUrl: './danhsach-kehoach-lcnt.component.html',
  styleUrls: ['./danhsach-kehoach-lcnt.component.scss']
})
export class DanhsachKehoachLcntComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService: DanhSachDauThauService,
    private modal: NzModalService,
    public userService: UserService,
    private route: ActivatedRoute,
    private helperService: HelperService
  ) {

  }
  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;

  isDetail: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  searchFilter = {
    soDx: '',
    namKh: dayjs().get('year'),
    ngayTongHop: '',
    loaiVthh: '',
    trichYeu: ''
  };
  listVthh: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  userInfo: UserLogin;
  selectedId: number = 0;
  isTongCuc: boolean = false;
  isCuc: boolean = false;

  allChecked = false;
  indeterminate = false;

  async ngOnInit() {
    try {
      this.isTongCuc = this.userService.isTongCuc();
      this.isCuc = this.userService.isCuc();
      this.userInfo = this.userService.getUserLogin();
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.searchFilter.loaiVthh = this.loaiVthh;
      await this.search();
    }
    catch (e) {
      console.log('error: ', e)
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

  async search() {
    this.spinner.show();
    let body = {
      tuNgayKy: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
        : null,
      denNgayKy: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
        : null,
      soTr: this.searchFilter.soDx,
      loaiVthh: this.searchFilter.loaiVthh,
      namKh: this.searchFilter.namKh,
      trichYeu: this.searchFilter.trichYeu,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.danhSachDauThauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.totalRecord = data.totalElements;
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

  themMoi() {
    this.isDetail = true;
    this.selectedId = null;
    this.loaiVthh = this.loaiVthhCache;
  }

  showList() {
    this.isDetail = false;
    this.search()
  }

  detail(data?) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.loaiVthh = data.loaiVthh;
  }

  clearFilter() {
    this.searchFilter.namKh = dayjs().get('year');
    this.searchFilter.soDx = null;
    this.searchFilter.ngayTongHop = null;
    this.searchFilter.trichYeu = null;
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
          let body = {
            "id": item.id,
          }
          this.danhSachDauThauService.delete(body).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
          this.spinner.hide();
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  convertTrangThai(status: string) {
    switch (status) {
      case '00': {
        return 'Dự thảo'
      }
      case '03': {
        return 'Từ chối'
      }
      case '01': {
        return 'Chờ duyệt - TP'
      }
      case '09': {
        return 'Chờ duyệt - LĐ Cục'
      }
      case '02': {
        return 'Đã duyệt'
      }
    }
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
            // let res = await this.deXuatDieuChinhService.deleteMultiple({ ids: dataDelete });
            // if (res.msg == MESSAGE.SUCCESS) {
            //   this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            //   await this.search();
            // } else {
            //   this.notification.error(MESSAGE.ERROR, res.msg);
            // }
            this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  checkCanUpdate() {
    if (this.loaiVthh == 'tat-ca' || this.loaiVthh == '02' || this.isCuc) {
      return true;
    }
    return false;
  }
}
