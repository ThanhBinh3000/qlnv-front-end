import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { Subject } from 'rxjs';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapKho.service';
import { Globals } from 'src/app/shared/globals';
import {
  QuyetDinhGiaoNhapHangService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service";
import { STATUS } from "../../../../../constants/status";

@Component({
  selector: 'quan-ly-phieu-nhap-kho',
  templateUrl: './quan-ly-phieu-nhap-kho.component.html',
  styleUrls: ['./quan-ly-phieu-nhap-kho.component.scss'],
})
export class QuanLyPhieuNhapKhoComponent implements OnInit {
  @Input() loaiVthh: string;

  searchFilter = {
    soPhieu: '',
    ngayNhapKho: '',
    soQuyetDinh: '',
  };

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganLo: any[] = [];

  userInfo: UserLogin;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  STATUS = STATUS
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;
  idQdGiaoNvNh: number = 0;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    soQuyetDinhNhap: '',
    soPhieu: '',
    ngayNhapKho: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganLo: '',
    tenTrangThai: '',
  };

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
    private notification: NzNotificationService,
    private router: Router,
    public userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private modal: NzModalService,
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
    } catch (e) {
      console.log('error: ', e);
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

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
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

  clearFilter() {
    this.searchFilter = {
      soPhieu: '',
      ngayNhapKho: '',
      soQuyetDinh: '',
    };
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
          this.quanLyPhieuNhapKhoService.delete({ id: item.id }).then((res) => {
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

  async search() {
    await this.spinner.show();
    let body = {
      trangThai: STATUS.BAN_HANH,
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
      this.convertDataTable();
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  convertDataTable() {
    // this.dataTable.forEach(item => {
    //   item.detail = item.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0];
    // });
    this.dataTable.forEach(item => {
      if (this.userService.isChiCuc()) {
        item.detail = item.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
      } else {
        let data = [];
        item.dtlList.forEach(item => {
          data = [...data, ...item.children];
        })
        item.detail = {
          children: data
        }
      };
    });
    this.dataTable.forEach(item => {
      item.detail.children.forEach(ddNhap => {
        ddNhap.listPhieuNhapKho.forEach(x => {
          x.phieuKiemTraCl = ddNhap.listPhieuKtraCl.filter(item => item.soPhieu == x.soPhieuKtraCl)[0];
          x.bienBanGuiHang = ddNhap.bienBanGuiHang
        });
      })
    });
    console.log(this.dataTable);
  }

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body =
        {
          "denNgayNhapKho": this.searchFilter.ngayNhapKho && this.searchFilter.ngayNhapKho.length > 1 ? dayjs(this.searchFilter.ngayNhapKho[1]).format('YYYY-MM-DD') : null,
          "maDvi": this.userInfo.MA_DVI,
          "orderBy": null,
          "orderDirection": null,
          "paggingReq": null,
          "soPhieu": this.searchFilter.soPhieu,
          "soQdNhap": this.searchFilter.soQuyetDinh,
          "str": null,
          "trangThai": null,
          "tuNgayNhapKho": this.searchFilter.ngayNhapKho && this.searchFilter.ngayNhapKho.length > 0 ? dayjs(this.searchFilter.ngayNhapKho[0]).format('YYYY-MM-DD') : null,
        }
        this.quanLyPhieuNhapKhoService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-phieu-nhap-kho.xlsx'),
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

  print() {

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
