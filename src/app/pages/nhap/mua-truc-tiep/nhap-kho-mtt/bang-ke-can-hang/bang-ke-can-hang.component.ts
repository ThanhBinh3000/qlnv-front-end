import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuyetDinhGiaoNvNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { BangCanKeMuaTrucTiepService } from 'src/app/services/bang-can-ke-mua-truc-tiep.service';

@Component({
  selector: 'app-bang-ke-can-hang',
  templateUrl: './bang-ke-can-hang.component.html',
  styleUrls: ['./bang-ke-can-hang.component.scss']
})
export class BangKeCanHangComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  searchFilter = {
    namKh: '',
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
  idQdGiaoNvNh: number = 0;

  allChecked = false;
  indeterminate = false;
  listNam: any[] = [];
  tuNgayNkho: Date | null = null;
  denNgayNkho: Date | null = null;

  filterTable: any = {
    soBangKeCanHang: '',
    soPhieuNhapKho: '',
    ngayNkho: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganLo: '',
    tenTrangThai: '',
  };

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bangCanKeMuaTrucTiepService: BangCanKeMuaTrucTiepService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCanKeMuaTrucTiepService);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
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
      trangThai: this.STATUS.BAN_HANH,
      tuNgayNkho: this.tuNgayNkho != null ? dayjs(this.tuNgayNkho).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayNkho: this.denNgayNkho != null ? dayjs(this.denNgayNkho).format('YYYY-MM-DD') + " 23:59:59": null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1
      },
      loaiVthh: this.loaiVthh
    };
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      // this.convertDataTable();
      this.dataTable.forEach(item => {
        if (this.userService.isChiCuc()) {
          item.detail = item.hhQdGiaoNvNhangDtlList.filter(y => y.maDvi == this.userInfo.MA_DVI)[0]
          item.detail = {
            children: item.detail.children.filter(x => x.maDiemKho.substring(0, x.maDiemKho.length - 2) == this.userInfo.MA_DVI)
          }
          item.expand = true;
        } else {
          let data = [];
          item.hhQdGiaoNvNhangDtlList.forEach(res => {
            data = [...data, ...res.children.filter(x => x.idDtl == res.id)];
          })
          item.detail = {
            children: data,
          }
          item.expand = true;
        };
      });
      console.log(this.dataTable)
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }

  convertDataTable() {
    this.dataTable.forEach(item => {
      if (this.userService.isChiCuc()) {
        item.detail = item.hhBcanKeHangHdrList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
      } else {
        let data = [];
        item.hhBcanKeHangHdrList.forEach(item => {
          // data = [...data, ...item.children];
        })
        item.detail = {
          // children: data
        }
      };
    });
  }

  clearFilter() {
    this.searchFilter = {
      namKh: '',
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
          let body = {
            id: item.id,
            maDvi: '',
          };
          this.bangCanKeMuaTrucTiepService.delete(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
          this.spinner.hide();
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

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh;

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
          tuNgayNkho: this.tuNgayNkho != null ? dayjs(this.tuNgayNkho).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayNkho: this.denNgayNkho != null ? dayjs(this.denNgayNkho).format('YYYY-MM-DD') + " 23:59:59": null,
          namKh: this.searchFilter.namKh,
          soQuyetDinhNhap: this.searchFilter.soQuyetDinhNhap,
          soBangKeCanHang: this.searchFilter.soBangKeCanHang,
        };
        this.bangCanKeMuaTrucTiepService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bang-ke-can-hang.xlsx'),
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

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayNkho) {
      return false;
    }
    return startValue.getTime() > this.denNgayNkho.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayNkho) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayNkho.getTime();
  };
}

