import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import * as dayjs from 'dayjs';
import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserLogin } from 'src/app/models/userlogin';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'quan-ly-phieu-nhap-day-kho',
  templateUrl: './quan-ly-phieu-nhap-day-kho.component.html',
  styleUrls: ['./quan-ly-phieu-nhap-day-kho.component.scss'],
})
export class QuanLyPhieuNhapDayKhoComponent implements OnInit {
  @Input() typeVthh: string;

  searchFilter = {
    soQd: '',
    soBienBan: '',
    ngayNhapDayKho: '',
    ngayKetThucNhap: '',
    maDiemKho: '',
    maNhaKho: '',
    maKhoNganLo: '',
    kyThuatVien: '',
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
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable = {
    soQuyetDinhNhap: '',
    soBienBan: '',
    ngayBatDauNhap: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganLo: '',
    noiDung: '',
  }
  dataTableAll: any[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private notification: NzNotificationService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.typeVthh == 'tat-ca') {
        this.isTatCa = true;
      }
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
    let param =
    {
      "maDvi": this.userInfo.MA_DVI,
      "maVatTuCha": this.isTatCa ? null : this.maVthh,
      "ngayKetThucNhapTu": this.searchFilter.ngayKetThucNhap && this.searchFilter.ngayKetThucNhap.length > 0 ? dayjs(this.searchFilter.ngayKetThucNhap[0]).format('YYYY-MM-DD') : null,
      "ngayKetThucNhapDen": this.searchFilter.ngayKetThucNhap && this.searchFilter.ngayKetThucNhap.length > 1 ? dayjs(this.searchFilter.ngayKetThucNhap[1]).format('YYYY-MM-DD') : null,
      "ngayNhapDayKhoDen": this.searchFilter.ngayNhapDayKho && this.searchFilter.ngayNhapDayKho.length > 1 ? dayjs(this.searchFilter.ngayNhapDayKho[1]).format('YYYY-MM-DD') : null,
      "ngayNhapDayKhoTu": this.searchFilter.ngayNhapDayKho && this.searchFilter.ngayNhapDayKho.length > 0 ? dayjs(this.searchFilter.ngayNhapDayKho[0]).format('YYYY-MM-DD') : null,
      "pageNumber": this.page,
      "pageSize": this.pageSize,
      "soBienBan": this.searchFilter.soBienBan,
      "soQdNhap": this.searchFilter.soQd,
    }
    let res = await this.quanLyPhieuNhapDayKhoService.timKiem(param);
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
      soQd: '',
      soBienBan: '',
      ngayNhapDayKho: '',
      ngayKetThucNhap: '',
      maDiemKho: '',
      maNhaKho: '',
      maKhoNganLo: '',
      kyThuatVien: '',
    };
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
          this.quanLyPhieuNhapDayKhoService.xoa(item.id).then((res) => {
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView;
  }

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "maDvi": this.userInfo.MA_DVI,
          "maVatTuCha": this.isTatCa ? null : this.maVthh,
          "ngayKetThucNhapDen": this.searchFilter.ngayKetThucNhap && this.searchFilter.ngayKetThucNhap.length > 1 ? dayjs(this.searchFilter.ngayKetThucNhap[1]).format('YYYY-MM-DD') : null,
          "ngayKetThucNhapTu": this.searchFilter.ngayKetThucNhap && this.searchFilter.ngayKetThucNhap.length > 0 ? dayjs(this.searchFilter.ngayKetThucNhap[0]).format('YYYY-MM-DD') : null,
          "ngayNhapDayKhoDen": this.searchFilter.ngayNhapDayKho && this.searchFilter.ngayNhapDayKho.length > 1 ? dayjs(this.searchFilter.ngayNhapDayKho[1]).format('YYYY-MM-DD') : null,
          "ngayNhapDayKhoTu": this.searchFilter.ngayNhapDayKho && this.searchFilter.ngayNhapDayKho.length > 0 ? dayjs(this.searchFilter.ngayNhapDayKho[0]).format('YYYY-MM-DD') : null,
          "orderBy": null,
          "orderDirection": null,
          "paggingReq": null,
          "soBienBan": this.searchFilter.soBienBan,
          "soQdNhap": this.searchFilter.soQd,
          "str": null,
          "trangThai": null
        }
        this.quanLyPhieuNhapDayKhoService.exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-phieu-nhap-day-kho.xlsx'),
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
            let res = await this.quanLyPhieuNhapDayKhoService.deleteMultiple({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
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
      soQuyetDinhNhap: '',
      soBienBan: '',
      ngayBatDauNhap: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganLo: '',
      noiDung: '',
    }
  }

  print() {

  }
}
