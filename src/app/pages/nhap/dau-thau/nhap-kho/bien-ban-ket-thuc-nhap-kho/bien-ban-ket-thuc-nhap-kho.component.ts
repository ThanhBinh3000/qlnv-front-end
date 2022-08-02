import { saveAs } from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanKetThucNhapKho } from 'src/app/models/BienBanKetThucNhapKho';
import { UserLogin } from 'src/app/models/userlogin';
import { QuanLyBienBanKetThucNhapKhoService } from 'src/app/services/quanLyBienBanKetThucNhapKho.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-bien-ban-ket-thuc-nhap-kho',
  templateUrl: './bien-ban-ket-thuc-nhap-kho.component.html',
  styleUrls: ['./bien-ban-ket-thuc-nhap-kho.component.scss']
})
export class BienBanKetThucNhapKhoComponent implements OnInit {
  @Input() typeVthh: string;
  searchFilter = {
    soQuyetDinhNhap: '',
    soBienBan: '',
    ngayNhapDayKho: '',
    ngayKetThucNhap: '',
  };

  listDiemKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  loaiVthh: string;
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
    soQd: '',
    soBienBan: '',
    ngayBatDauNhap: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganLo: '',
    trangThai: '',
  }
  dataTableAll: any[] = [];
  bienBanKetThucNhapKho: BienBanKetThucNhapKho = new BienBanKetThucNhapKho();
  constructor(
    private spinner: NgxSpinnerService,
    private quanLyPhieuKetThucNhapKhoService: QuanLyBienBanKetThucNhapKhoService,
    private notification: NzNotificationService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
  ) { }

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
    let param =
    {
      "ngayKetThucTu": this.searchFilter.ngayKetThucNhap && this.searchFilter.ngayKetThucNhap.length > 1
        ? dayjs(this.searchFilter.ngayKetThucNhap[0]).format('YYYY-MM-DD')
        : null,
      "ngayKetThucDen": this.searchFilter.ngayKetThucNhap && this.searchFilter.ngayKetThucNhap.length > 0
        ? dayjs(this.searchFilter.ngayKetThucNhap[1]).format('YYYY-MM-DD')
        : null,
      "ngayNhapDayKhoTu": this.searchFilter.ngayNhapDayKho && this.searchFilter.ngayNhapDayKho.length > 1
        ? dayjs(this.searchFilter.ngayNhapDayKho[0]).format('YYYY-MM-DD')
        : null,
      "ngayNhapDayKhoDen": this.searchFilter.ngayNhapDayKho && this.searchFilter.ngayNhapDayKho.length > 0
        ? dayjs(this.searchFilter.ngayNhapDayKho[1]).format('YYYY-MM-DD')
        : null,
      "pageSize": this.pageSize,
      "pageNumber": this.page,
      "soBienBan": this.searchFilter.soBienBan,
      "soQdNhap": this.searchFilter.soQuyetDinhNhap
    }
    let res = await this.quanLyPhieuKetThucNhapKhoService.timKiem(param);
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
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  clearFilter() {
    this.searchFilter = {
      soQuyetDinhNhap: '',
      soBienBan: '',
      ngayNhapDayKho: '',
      ngayKetThucNhap: '',
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
          this.quanLyPhieuKetThucNhapKhoService.deleteData(item.id).then((res) => {
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

  redirectToChiTiet(id: number, isView?: boolean) {
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
            let res = await this.quanLyPhieuKetThucNhapKhoService.deleteMultiple({ ids: dataDelete });
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
          "ngayKetThucDen": this.searchFilter.ngayKetThucNhap && this.searchFilter.ngayKetThucNhap.length > 0
            ? dayjs(this.searchFilter.ngayKetThucNhap[1]).format('YYYY-MM-DD')
            : null,
          "ngayKetThucTu": this.searchFilter.ngayKetThucNhap && this.searchFilter.ngayKetThucNhap.length > 1
            ? dayjs(this.searchFilter.ngayKetThucNhap[0]).format('YYYY-MM-DD')
            : null,
          "ngayNhapDayKhoDen": this.searchFilter.ngayNhapDayKho && this.searchFilter.ngayNhapDayKho.length > 0
            ? dayjs(this.searchFilter.ngayNhapDayKho[1]).format('YYYY-MM-DD')
            : null,
          "ngayNhapDayKhoTu": this.searchFilter.ngayNhapDayKho && this.searchFilter.ngayNhapDayKho.length > 1
            ? dayjs(this.searchFilter.ngayNhapDayKho[0]).format('YYYY-MM-DD')
            : null,
          "paggingReq": {
            "limit": this.pageSize,
            "orderBy": "string",
            "orderType": "string",
            "page": this.page,
          },
          "soBienBan": this.searchFilter.soBienBan,
          "soQdNhap": this.searchFilter.soQuyetDinhNhap
        };
        this.quanLyPhieuKetThucNhapKhoService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-ket-thuc-nhap-kho.xlsx'),
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
      soQd: '',
      soBienBan: '',
      ngayBatDauNhap: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganLo: '',
      trangThai: '',
    }
  }

}
