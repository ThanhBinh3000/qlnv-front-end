import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { QuanLyBangKeCanHangService } from 'src/app/services/quanLyBangKeCanHang.service';
import { BaseComponent } from "../../../../../components/base/base.component";
import {
  QuyetDinhGiaoNhapHangService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'quan-ly-bang-ke-can-hang',
  templateUrl: './quan-ly-bang-ke-can-hang.component.html',
  styleUrls: ['./quan-ly-bang-ke-can-hang.component.scss'],
})
export class QuanLyBangKeCanHangComponent extends Base2Component implements OnInit {
  @Input() typeVthh: string;

  searchFilter = {
    namKhoach: '',
    soQuyetDinh: '',
    soBangKe: ''
  };

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganLo: any[] = [];
  maNganLoKho: string;
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

  filterTable: any = {
    soQuyetDinhNhap: '',
    soPhieuNhapKho: '',
    ngayNhapKho: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganLo: '',
    tenTrangThai: '',
  };

  tuNgayTao: Date | null = null;
  denNgayTao: Date | null = null;
  disabledTuNgayTao = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayTao) {
      return false;
    }
    return startValue.getTime() > this.denNgayTao.getTime();
  };

  disabledDenNgayTao = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayTao) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayTao.getTime();
  };

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLyBangKeCanHangService: QuanLyBangKeCanHangService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyBangKeCanHangService);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.search(),
      ]);
      await this.checkPriceAdjust('xuất hàng');
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
      paggingReq: {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.typeVthh,
      soQd: this.searchFilter.soQuyetDinh,
      namNhap: this.searchFilter.namKhoach,
      soBkch: this.searchFilter.soBangKe,
      tuNgayTaoBkch: this.tuNgayTao != null ? dayjs(this.tuNgayTao).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayTaoBkch: this.denNgayTao != null ? dayjs(this.denNgayTao).format('YYYY-MM-DD') + " 23:59:59" : null,
    };
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.convertDataTable();
      this.dataTableAll = cloneDeep(this.dataTable);
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
    for (let i = 0; i < this.dataTable.length; i++) {
      this.expandSet.add(i)
      for (let j = 0; j < this.dataTable[i].detail.children.length; j++) {
        this.expandSet2.add(j)
        this.dataTable[i].detail.children[j].listBangKeCanHang.forEach(x => {
          x.phieuNhapKho = this.dataTable[i].detail.children[j].listPhieuNhapKho.filter(item => item.soPhieuNhapKho == x.soPhieuNhapKho)[0];
        });
      }
    }
  }

  clearFilter() {
    this.searchFilter = {
      namKhoach: '',
      soQuyetDinh: '',
      soBangKe: '',
    };
    this.tuNgayTao = null;
    this.denNgayTao = null;
    this.search()
  }

  xoaItem(item: any) {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
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
          this.quanLyBangKeCanHangService.delete({ id: item.id }).then((res) => {
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

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number, maNganLoKho?: string) {
    if (id == 0 && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh;
    this.maNganLoKho = maNganLoKho;
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
          trangThai: this.STATUS.BAN_HANH,
          paggingReq: {
            "limit": this.pageSize,
            "page": this.page - 1
          },
          loaiVthh: this.typeVthh,
          soQd: this.searchFilter.soQuyetDinh,
          namNhap: this.searchFilter.namKhoach,
          soBkch: this.searchFilter.soBangKe,
          tuNgayTaoBkch: this.tuNgayTao != null ? dayjs(this.tuNgayTao).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayTaoBkch: this.denNgayTao != null ? dayjs(this.denNgayTao).format('YYYY-MM-DD') + " 23:59:59" : null,
        };
        this.quanLyBangKeCanHangService
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

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BKCH_XEM') && data != null) {
      if(this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BKCH_THEM')
        && (data.trangThai == STATUS.DU_THAO
          || data.trangThai == STATUS.TU_CHOI_LDCC)) {
        return false;
      }  else if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BKCH_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC) {
        return false;
      }
      return true;
    }
    return false;
  }
}

