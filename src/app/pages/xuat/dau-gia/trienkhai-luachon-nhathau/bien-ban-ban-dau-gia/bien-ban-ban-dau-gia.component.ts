import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyBienBanBanDauGiaService } from 'src/app/services/quanLyBienBanBanDauGia.service';
import { UserService } from 'src/app/services/user.service';
import {
  convertTrangThai,
  convertTrangThaiGt
} from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-bien-ban-ban-dau-gia',
  templateUrl: './bien-ban-ban-dau-gia.component.html',
  styleUrls: ['./bien-ban-ban-dau-gia.component.scss'],
})
export class BienBanBanDauGiaComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private quanLyBienBanBanDauGiaService: QuanLyBienBanBanDauGiaService,
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) { }

  listNam: any[] = [];
  yearNow: number = 0;
  isView: boolean = false;
  searchFilter = {
    nam: dayjs().get('year'),
    loaiVthh: '',
    soBienBan: '',
    maThongBaoBdg: '',
    trichYeu: '',
    ngayToChucBdg: '',
  };
  filterTable: any = {
    soBienBan: '',
    ngayToChucTu: '',
    trichYeu: '',
    soQdPdKhBdg: '',
    maThongBaoBdg: '',
    hinhThucDauGia: '',
    phuongThucDauGia: '',
    tenVatTuCha: '',
    nam: '',
    soQdPdKqBdg: '',
    tenTrangThai: '',
  };
  dataTableAll: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  listVthh: any[] = [];
  lastBreadcrumb: string;
  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  allChecked = false;
  indeterminate = false;

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.getListVthh();
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

  async getListVthh() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((element) => {
          element.count = 0;
          this.listVthh.push(element);
        });
      }
    }
  }

  clearFilter() {
    this.searchFilter = {
      nam: dayjs().get('year'),
      loaiVthh: '',
      soBienBan: '',
      maThongBaoBdg: '',
      trichYeu: '',
      ngayToChucBdg: '',
    };
    this.search();
  }

  async search() {
    let body = {
      loaiVthh: this.searchFilter.loaiVthh,
      maDvis: this.userInfo.MA_DVI,
      maThongBaoBdg: this.searchFilter.maThongBaoBdg,
      nam: this.searchFilter.nam,
      ngayToChucBdgDen: this.searchFilter.ngayToChucBdg
        ? dayjs(this.searchFilter.ngayToChucBdg[1]).format('YYYY-MM-DD')
        : null,
      ngayToChucBdgTu: this.searchFilter.ngayToChucBdg
        ? dayjs(this.searchFilter.ngayToChucBdg[0]).format('YYYY-MM-DD')
        : null,
      pageSize: this.pageSize,
      pageNumber: this.page,
      soBienBan: this.searchFilter.soBienBan,
      trichYeu: this.searchFilter.trichYeu,
    };
    let res = await this.quanLyBienBanBanDauGiaService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      console.log(res.data.content)
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.statusConvert = this.convertTrangThai(item.trangThai);
          item.statusGT = this.statusGoiThau(item.statusGthau);
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
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

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
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
          this.quanLyBienBanBanDauGiaService
            .deleteData(item)
            .then(async (res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.DELETE_SUCCESS,
                );
                this.allChecked = false;
                this.search();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
              await this.search();
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

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  statusGoiThau(status: string) {
    return convertTrangThaiGt(status);
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          loaiVthh: this.searchFilter.loaiVthh,
          maDvis: [this.userInfo.MA_DVI],
          maThongBaoBdg: this.searchFilter.maThongBaoBdg,
          nam: this.searchFilter.nam,
          ngayToChucBdgDen: this.searchFilter.ngayToChucBdg
            ? dayjs(this.searchFilter.ngayToChucBdg[1]).format('YYYY-MM-DD')
            : null,
          ngayToChucBdgTu: this.searchFilter.ngayToChucBdg
            ? dayjs(this.searchFilter.ngayToChucBdg[0]).format('YYYY-MM-DD')
            : null,
          soBienBan: this.searchFilter.soBienBan,
          trichYeu: this.searchFilter.trichYeu,
        };
        this.quanLyBienBanBanDauGiaService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-ban-dau-gia.xlsx'),
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
            let res = await this.quanLyBienBanBanDauGiaService.deleteMultiple({
              ids: dataDelete,
            });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
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
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .indexOf(value.toString().toLowerCase()) != -1
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
      soBienBan: '',
      ngayToChucTu: '',
      trichYeu: '',
      soQdPdKhBdg: '',
      maThongBaoBdg: '',
      hinhThucDauGia: '',
      phuongThucDauGia: '',
      tenVatTuCha: '',
      nam: '',
      soQdPdKqBdg: '',
      tenTrangThai: '',
    };
  }
}
