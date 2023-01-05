import { cloneDeep } from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { QuanLyBangKeCanHangService } from 'src/app/services/quanLyBangKeCanHang.service';
import {
  QuyetDinhGiaoNhapHangService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { BangCanKeMuaTrucTiepService } from 'src/app/services/bang-can-ke-mua-truc-tiep.service';

@Component({
  selector: 'app-bang-ke-can-hang',
  templateUrl: './bang-ke-can-hang.component.html',
  styleUrls: ['./bang-ke-can-hang.component.scss']
})
export class BangKeCanHangComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  searchFilter = {
    namKh: dayjs().get('year'),
    soQuyetDinhNhap: '',
    soBangKeCanHang: '',
    ngayNkho: '',
  };

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganLo: any[] = [];

  userInfo: UserLogin;

  dataTable: any[] = [];
  dataTableAll: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    soQuyetDinhNhap: '',
    namKh: '',
    ngayNkho: '',
    soBangKeCanHang: '',
    soPhieuNhapKho: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganKho: '',
    tenLoKho: '',
    tenTrangThai: '',
  };

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bangCanKeMuaTrucTiepService: BangCanKeMuaTrucTiepService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCanKeMuaTrucTiepService);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      super.ngOnInit();
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


  async search() {
    await this.spinner.show();
    let body = {
      ngayNhapKhoTu: this.searchFilter.ngayNkho
        ? dayjs(this.searchFilter.ngayNkho[0]).format('YYYY-MM-DD')
        : null,
      ngayNhapKhoDen: this.searchFilter.ngayNkho
        ? dayjs(this.searchFilter.ngayNkho[1]).format('YYYY-MM-DD')
        : null,
      namKh: this.searchFilter.namKh,
      soQuyetDinhNhap: this.searchFilter.soQuyetDinhNhap,
      soBangKeCanHang: this.searchFilter.soBangKeCanHang,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.bangCanKeMuaTrucTiepService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  clearFilter() {
    this.searchFilter = {
      namKh: dayjs().get('year'),
      soQuyetDinhNhap: '',
      soBangKeCanHang: '',
      ngayNkho: '',
    };
    this.search()
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
          this.bangCanKeMuaTrucTiepService.delete(item.id).then((res) => {
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayNhapKhoTu: this.searchFilter.ngayNkho
            ? dayjs(this.searchFilter.ngayNkho[0]).format('YYYY-MM-DD')
            : null,
          ngayNhapKhoDen: this.searchFilter.ngayNkho
            ? dayjs(this.searchFilter.ngayNkho[1]).format('YYYY-MM-DD')
            : null,
          namKh: this.searchFilter.namKh,
          soQuyetDinhNhap: this.searchFilter.soQuyetDinhNhap,
          soBangKeCanHang: this.searchFilter.soBangKeCanHang,
        };
        this.bangCanKeMuaTrucTiepService
          .export(body)
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

