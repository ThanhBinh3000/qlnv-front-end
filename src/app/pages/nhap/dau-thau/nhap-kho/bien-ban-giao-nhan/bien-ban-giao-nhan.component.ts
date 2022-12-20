import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/components/base/base.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanKetThucNhapKho } from 'src/app/models/BienBanKetThucNhapKho';
import { UserLogin } from 'src/app/models/userlogin';
import { QuanLyBienBanGiaoNhanService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyBienBanGiaoNhan.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { QuanLyBienBanKetThucNhapKhoService } from 'src/app/services/quanLyBienBanKetThucNhapKho.service';
import { StorageService } from 'src/app/services/storage.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-bien-ban-giao-nhan',
  templateUrl: './bien-ban-giao-nhan.component.html',
  styleUrls: ['./bien-ban-giao-nhan.component.scss']
})
export class BienBanGiaoNhanComponent extends BaseComponent implements OnInit {
  @Input() loaiVthh: string;
  searchFilter = {
    soBienBan: '',
    ngayHopDong: '',
    benGiao: '',
    tenTrangThai: '',
    soHopDong: '',
    ngayKy: '',
    nam: '',
    soQuyetDinhNhap: '',
  };

  listDiemKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  loaiStr: string;
  maVthh: string;
  idVthh: number;
  routerVthh: string;

  userInfo: UserLogin;

  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  allChecked = false;
  indeterminate = false;

  filterTable = {
    soBienBan: '',
    ngayGiaoNhan: '',
    benGiao: '',
    tenTrangThai: '',
    soHopDong: '',
    ngayKy: '',
    nam: '',
    soQuyetDinhNhap: '',
  }
  dataTableAll: any[] = [];
  bienBanKetThucNhapKho: BienBanKetThucNhapKho = new BienBanKetThucNhapKho();
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private quanLyBienBanBanGiaoNhanService: QuanLyBienBanGiaoNhanService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    public userService: UserService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService
  ) {
    super(httpClient, storageService, quanLyBienBanBanGiaoNhanService);
    super.ngOnInit();
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.search(),
      ]);
      this.spinner.hide();
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
          if (item.trangThai == this.globals.prop.NHAP_DU_THAO) {
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
    await this.spinner.show();
    let body = {
      trangThai: this.STATUS.BAN_HANH,
      paggingReq: {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.loaiVthh
    };
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }


  clearFilter() {
    this.searchFilter = {
      soBienBan: '',
      ngayHopDong: '',
      benGiao: '',
      tenTrangThai: '',
      soHopDong: '',
      ngayKy: '',
      nam: '',
      soQuyetDinhNhap: '',
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
          this.quanLyBienBanBanGiaoNhanService.delete({ id: item.id }).then((res) => {
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

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
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
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  async loadNganKho() {
    let body = {
      "maNganKho": null,
      "nhaKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganKho": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
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
            let res = await this.quanLyBienBanBanGiaoNhanService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              this.allChecked = false;
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
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "ngayHopDongTu": this.searchFilter.ngayHopDong && this.searchFilter.ngayHopDong.length > 1
            ? dayjs(this.searchFilter.ngayHopDong[0]).format('YYYY-MM-DD')
            : null,
          "ngayHopDongDen": this.searchFilter.ngayHopDong && this.searchFilter.ngayHopDong.length > 0
            ? dayjs(this.searchFilter.ngayHopDong[1]).format('YYYY-MM-DD')
            : null,
          "pageSize": this.pageSize,
          "pageNumber": this.page,
          "soBienBan": this.searchFilter.soBienBan,
          "nam": this.searchFilter.nam,
          "soHopDong": this.searchFilter.soHopDong,
          "soQdNhap": this.searchFilter.soQuyetDinhNhap
        };
        this.quanLyBienBanBanGiaoNhanService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-giao-nhan.xlsx'),
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

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    }
    else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soBienBan: '',
      ngayGiaoNhan: '',
      benGiao: '',
      tenTrangThai: '',
      soHopDong: '',
      ngayKy: '',
      nam: '',
      soQuyetDinhNhap: ''
    }
  }
  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }
}
