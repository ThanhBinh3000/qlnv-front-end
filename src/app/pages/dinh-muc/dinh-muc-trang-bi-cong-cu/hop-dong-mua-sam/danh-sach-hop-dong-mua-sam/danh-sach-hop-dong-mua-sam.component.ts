import { cloneDeep } from 'lodash';
import { convertTenVthh } from 'src/app/shared/commonFunction';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DonviService } from 'src/app/services/donvi.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-danh-sach-hop-dong-mua-sam',
  templateUrl: './danh-sach-hop-dong-mua-sam.component.html',
  styleUrls: ['./danh-sach-hop-dong-mua-sam.component.scss']
})
export class DanhSachHopDongMuaSamComponent implements OnInit {
  @Input()
  typeVthh: string;

  ngayKy: string;
  soHd: string;
  userInfo: UserLogin;
  tenHd: string;
  nhaCungCap: string;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};

  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    soHd: '',
    tenHd: '',
    ngayKy: '',
    loaiVthh: '',
    chungLoaiVthh: '',
    chuDauTu: '',
    nhaCungCap: '',
    gtriHdSauVat: '',
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private donViService: DonviService,
    private thongTinHopDong: ThongTinHopDongService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await this.loadDonVi();
      await this.search();
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
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
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
      loaiVthh: '',
      maDvi: maDonVi,
      nhaCcap: this.nhaCungCap ?? '',
      tenHd: this.tenHd ?? '',
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      soHd: this.soHd,
      denNgayKy:
        this.ngayKy && this.ngayKy.length > 1
          ? dayjs(this.ngayKy[1]).format('YYYY-MM-DD')
          : null,
      tuNgayKy:
        this.ngayKy && this.ngayKy.length > 0
          ? dayjs(this.ngayKy[0]).format('YYYY-MM-DD')
          : null,
    };
    let res = await this.thongTinHopDong.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
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
      nzOnOk: async () => {
        const body = {
          id: item.id,
        };
        let res = await this.thongTinHopDong.delete(body);
        if (res.msg == MESSAGE.SUCCESS) {
          this.search();
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      },
    });
  }

  clearFilter() {
    this.ngayKy = null;
    this.soHd = null;
    this.tenHd = null;
    this.nhaCungCap = null;
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
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
          loaiVthh: '',
          maDvi: maDonVi,
          nhaCcap: this.nhaCungCap ?? '',
          tenHd: this.tenHd ?? '',
          soHd: this.soHd,
          denNgayKy:
            this.ngayKy && this.ngayKy.length > 1
              ? dayjs(this.ngayKy[1]).format('YYYY-MM-DD')
              : null,
          tuNgayKy:
            this.ngayKy && this.ngayKy.length > 0
              ? dayjs(this.ngayKy[0]).format('YYYY-MM-DD')
              : null,
        };
        this.thongTinHopDong
          .export(body)
          .subscribe((blob) => saveAs(blob, 'thong-tin-hop-dong.xlsx'));
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
            // let res = await this.deXuatDieuChinhService.deleteMultiple({ids: dataDelete});
            // if (res.msg == MESSAGE.SUCCESS) {
            //   this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
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
    } else {
      this.notification.error(
        MESSAGE.ERROR,
        'Không có dữ liệu phù hợp để xóa.',
      );
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (
            item[key].toString().toLowerCase().indexOf(value.toLowerCase()) !=
            -1
          ) {
            temp.push(item);
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soHd: '',
      tenHd: '',
      ngayKy: '',
      loaiVthh: '',
      chungLoaiVthh: '',
      chuDauTu: '',
      nhaCungCap: '',
      gtriHdSauVat: '',
    };
  }
}
