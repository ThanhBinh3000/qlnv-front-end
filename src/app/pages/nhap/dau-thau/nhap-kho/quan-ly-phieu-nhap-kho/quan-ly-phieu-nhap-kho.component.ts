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
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {Base2Component} from "../../../../../components/base2/base2.component";

@Component({
  selector: 'quan-ly-phieu-nhap-kho',
  templateUrl: './quan-ly-phieu-nhap-kho.component.html',
  styleUrls: ['./quan-ly-phieu-nhap-kho.component.scss'],
})
export class QuanLyPhieuNhapKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  searchFilter = {
    soPhieu: '',
    ngayNhapKho: '',
    soQuyetDinh: '',
    namKhoach: '',
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
  listNam: any[] = [];
  tuNgayNk: Date | null = null;
  denNgayNk: Date | null = null;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayNk) {
      return false;
    }
    return startValue.getTime() > this.denNgayNk.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayNk) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayNk.getTime();
  };
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyPhieuNhapKhoService);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.search(),
      ]);
      await this.checkPriceAdjust('xuất hàng');
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    if (id == 0 && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
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
      namKhoach: '',
    };
    this.search();
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
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
      tuNgayNk: this.tuNgayNk != null ? dayjs(this.tuNgayNk).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayNk: this.denNgayNk != null ? dayjs(this.denNgayNk).format('YYYY-MM-DD') + " 23:59:59" : null,
      soPhieu: this.searchFilter.soPhieu,
      soQdGiaoNvNh: this.searchFilter.soQuyetDinh,
      nam: this.searchFilter.namKhoach,
      trangThai: STATUS.BAN_HANH,
      paggingReq: {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.loaiVthh
    };
    let res = await this.quanLyPhieuNhapKhoService.search(body);
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
        if (this.dataTable[i].detail.children[j].listPhieuNhapKho.length > 0) {
          this.expandSet2.add(j)
        }
        let soBbNtbqld = []
        this.dataTable[i].detail.children[j].listBbNtbqld.forEach(z => {
          soBbNtbqld.push(z.soBbNtBq)
        })
        this.dataTable[i].detail.children[j].soBbNtbqld = soBbNtbqld.join(', ')
        this.dataTable[i].detail.children[j].listPhieuNhapKho.forEach(x => {
          x.phieuKiemTraCl = this.dataTable[i].detail.children[j].listPhieuKtraCl.filter(item => item.soPhieu == x.soPhieuKtraCl)[0];
          x.bienBanGuiHang = this.dataTable[i].detail.children[j].bienBanGuiHang
        });
      }
    }
  }

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayNk: this.tuNgayNk != null ? dayjs(this.tuNgayNk).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayNk: this.denNgayNk != null ? dayjs(this.denNgayNk).format('YYYY-MM-DD') + " 23:59:59" : null,
          soPhieu: this.searchFilter.soPhieu,
          soQdGiaoNvNh: this.searchFilter.soQuyetDinh,
          nam: this.searchFilter.namKhoach,
          trangThai: STATUS.BAN_HANH,
          paggingReq: {
            "limit": this.pageSize,
            "page": this.page - 1
          },
          loaiVthh: this.loaiVthh
        };
        this.quanLyPhieuNhapKhoService
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

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_PNK_XEM') && data != null) {
      if(this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_PNK_THEM') && (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_LDCC)) {
        return false;
      } else if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_PNK_DUYET') && data.trangThai == STATUS.CHO_DUYET_LDCC) {
        return false;
      }
      return true;
    }
    return false;
  }
}
