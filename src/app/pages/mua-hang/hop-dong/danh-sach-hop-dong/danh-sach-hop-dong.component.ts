import { cloneDeep } from 'lodash';
import { convertTenVthh } from 'src/app/shared/commonFunction';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DonviService } from 'src/app/services/donvi.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-danh-sach-hop-dong',
  templateUrl: './danh-sach-hop-dong.component.html',
  styleUrls: ['./danh-sach-hop-dong.component.scss']
})
export class DanhSachHopDongComponent implements OnInit {
  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  ngayKy: string;
  soHd: string;
  routerVthh: string;
  userInfo: UserLogin;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private donViService: DonviService,
    private thongTinHopDong: ThongTinHopDongService,
  ) {
    router.events.subscribe((val) => {
      this.getTitleVthh();
    })
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    await this.loadDonVi();

    try {
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDonVi() {
    const res = await this.donViService.layDonViCon();
    this.optionsDonVi = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          ...res.data[i],
          labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
        };
        this.optionsDonVi.push(item);
      }
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.optionsDonViShow = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
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
      "loaiVthh": this.loaiVthh,
      maDvi: maDonVi,
      "paggingReq": {
        limit: this.pageSize,
        page: this.page,
      },
      soHd: this.soHd,
      //"trangThai": "string",
      denNgayKy: this.ngayKy && this.ngayKy.length > 1
        ? dayjs(this.ngayKy[1]).format('YYYY-MM-DD')
        : null,
      tuNgayKy: this.ngayKy && this.ngayKy.length > 0
        ? dayjs(this.ngayKy[0]).format('YYYY-MM-DD')
        : null,

    };
    let res = await this.thongTinHopDong.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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

      },
    });
  }

  clearFilter() {

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

  getTitleVthh() {
    if (this.router.url.indexOf("/thoc/") != -1) {
      this.loaiStr = "Thóc";
      this.loaiVthh = "01";
      this.maVthh = "0101";
      this.routerVthh = 'thoc';
    } else if (this.router.url.indexOf("/gao/") != -1) {
      this.loaiStr = "Gạo";
      this.loaiVthh = "00";
      this.maVthh = "0102";
      this.routerVthh = 'gao';
    } else if (this.router.url.indexOf("/muoi/") != -1) {
      this.loaiStr = "Muối";
      this.loaiVthh = "02";
      this.maVthh = "04";
      this.routerVthh = 'muoi';
    } else if (this.router.url.indexOf("/vat-tu/") != -1) {
      this.loaiStr = "Vật tư";
      this.loaiVthh = "03";
      this.routerVthh = 'vat-tu';
    }
  }

  redirectToChiTiet(isView: boolean, id: number) {
    if (!isView) {
      let urlChiTiet = this.router.url + '/thong-tin'
      this.router.navigate([urlChiTiet, id,]);
    }
    else {
      let urlChiTiet = this.router.url + '/xem-chi-tiet'
      this.router.navigate([urlChiTiet, id,]);
    }
  }

  exportData() {

  }
}
