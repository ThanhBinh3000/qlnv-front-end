import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/quanLyPhieuKiemNghiemChatLuongHang.service';

@Component({
  selector: 'quan-ly-phieu-kiem-nghiem-chat-luong-thoc',
  templateUrl: './quan-ly-phieu-kiem-nghiem-chat-luong-thoc.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-nghiem-chat-luong-thoc.component.scss'],
})
export class QuanLyPhieuKiemNghiemChatLuongThocComponent implements OnInit {
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  searchFilter = {
    ngayLayMau: '',
    soHopDong: '',
    diemkho: '',
    nhaKho: '',
    nganLoBaoQuan: ''
  };
  routerUrl: string;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,

  ) { }

  async ngOnInit() {
    this.routerUrl = this.router.url;
    this.spinner.show();
    try {
      let res = await this.donViService.layTatCaDonVi();
      await this.search();
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
      soPhieu: '',
      ngayKnghiemTuNgay: '',
      ngayKnghiemDenNgay: '',
      nhaKho: '',
      nganLoBaoQuan: '',
      pageNumber: this.page,
      pageSize: this.pageSize,
    };
    let res = await this.phieuKiemNghiemChatLuongHangService.timKiem(body);
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
      nganLoBaoQuan: ''
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
          this.phieuKiemNghiemChatLuongHangService.delete(item.id).then((res) => {
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
      this.router.navigate([urlChiTiet, id,]);
    }
    else {
      let urlChiTiet = this.router.url + '/thong-tin'
      this.router.navigate([urlChiTiet, id,]);
    }
  }
}
