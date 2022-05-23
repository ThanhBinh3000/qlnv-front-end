import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';

@Component({
  selector: 'quan-ly-phieu-kiem-tra-chat-luong-hang',
  templateUrl: './quan-ly-phieu-kiem-tra-chat-luong-hang.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-tra-chat-luong-hang.component.scss'],
})
export class QuanLyPhieuKiemTraChatLuongHangComponent implements OnInit {
  searchFilter = {
    soPhieu: '',
    maHangHoa: '',
    maDonVi: '',
    maNganKho: '',
    ngayKiemTraTuNgay: '',
    ngayKiemTraDenNgay: '',
  };
  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      const res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
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

  async search() {
    let maDonVi = null;
    let tenDvi = null;
    let donviId = null;
    if (this.inputDonVi && this.inputDonVi.length > 0) {
      let getDonVi = this.optionsDonVi.filter(
        (x) => x.labelDonVi == this.inputDonVi,
      );
      if (getDonVi && getDonVi.length > 0) {
        maDonVi = getDonVi[0].maDvi;
        tenDvi = getDonVi[0].tenDvi;
        donviId = getDonVi[0].id;
      }
    }
    let body = {
      soPhieu: this.searchFilter.soPhieu,
      maHangHoa: this.searchFilter.maHangHoa,
      maDonVi: maDonVi,
      maNganKho: this.searchFilter.maNganKho,
      ngayKiemTraTuNgay: this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
      ngayKiemTraDenNgay: this.endValue
        ? dayjs(this.endValue).format('YYYY-MM-DD')
        : null,
      pageNumber: this.page,
      pageSize: this.pageSize,
    };
    let res = await this.quanLyPhieuKiemTraChatLuongHangService.timKiem(body);
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
    this.searchFilter = {
      soPhieu: '',
      maHangHoa: '',
      maDonVi: '',
      maNganKho: '',
      ngayKiemTraTuNgay: '',
      ngayKiemTraDenNgay: '',
    };
    this.startValue = null;
    this.endValue = null;
    this.inputDonVi = '';
    this.search();
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
          // this.quanLyPhieuKiemTraChatLuongHangService.deleteData(item.id).then((res) => {
          //   if (res.msg == MESSAGE.SUCCESS) {
          //     this.notification.success(
          //       MESSAGE.SUCCESS,
          //       MESSAGE.DELETE_SUCCESS,
          //     );
          //     this.search();
          //   } else {
          //     this.notification.error(MESSAGE.ERROR, res.msg);
          //   }
          //   this.spinner.hide();
          // });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
  redirectToThemMoi() {
    this.router.navigate([
      'nhap/dau-thau/quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/',
      0,
    ]);
  }
}
