import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapDayKho.service';
import * as dayjs from 'dayjs';
import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserLogin } from 'src/app/models/userlogin';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhGiaoNhiemVuXuatHangService } from 'src/app/services/quyetDinhGiaoNhiemVuXuatHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";

@Component({
  selector: 'quan-ly-phieu-nhap-day-kho',
  templateUrl: './quan-ly-phieu-nhap-day-kho.component.html',
  styleUrls: ['./quan-ly-phieu-nhap-day-kho.component.scss'],
})
export class QuanLyPhieuNhapDayKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  searchFilter = {
    namNhap: '',
    soQd: '',
    soBienBan: '',
    ngayNhapDayKho: '',
  };

  tuNgayNhapDayKho: Date | null = null;
  denNgayNhapDayKho: Date | null = null;
  tuNgayTgianNkho: Date | null = null;
  denNgayTgianNkho: Date | null = null;
  STATUS = STATUS

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
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  idQdGiaoNvNh: number = 0;
  isView: boolean;

  filterTable = {
    soQuyetDinhNhap: '',
    soBienBan: '',
    ngayBatDauNhap: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganLo: '',
    noiDung: '',
    tenTrangThai: '',
  }
  dataTableAll: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyPhieuNhapDayKhoService);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
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
      trangThai: STATUS.BAN_HANH,
      paggingReq: {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.loaiVthh,
      soQd: this.searchFilter.soQd,
      namNhap: this.searchFilter.namNhap,
      tuNgayNhapDayKho: this.tuNgayNhapDayKho != null ? dayjs(this.tuNgayNhapDayKho).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayNhapDayKho: this.denNgayNhapDayKho != null ? dayjs(this.denNgayNhapDayKho).format('YYYY-MM-DD') + " 24:59:59" : null,
      tuNgayTgianNkho: this.tuNgayTgianNkho != null ? dayjs(this.tuNgayTgianNkho).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayTgianNkho: this.denNgayTgianNkho != null ? dayjs(this.denNgayTgianNkho).format('YYYY-MM-DD') + " 24:59:59" : null,
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
    for (let i = 0; i < this.dataTable.length; i++) {
      if (this.userService.isChiCuc()) {
        this.dataTable[i].detail = this.dataTable[i].dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
      } else {
        let data = [];
        this.dataTable[i].dtlList.forEach(item => {
          data = [...data, ...item.listBienBanNhapDayKho];
        })
        this.dataTable[i].detail = {
          listBienBanNhapDayKho: data
        }
      };
      this.expandSet.add(i)
      for (let j = 0; j < this.dataTable[i].detail.listBienBanNhapDayKho.length; j++) {
        this.expandSet2.add(j)
      }
    }
    // this.dataTable.forEach(item => {
    //   item.detail.children.forEach(ddNhap => {
    //     ddNhap.listPhieuNhapKho.forEach(x => {
    //       x.phieuKiemTraCl = ddNhap.listPhieuKtraCl.filter(item => item.soPhieu == x.soPhieuKtraCl)[0];
    //     });
    //   })
    // });
  }

  clearFilter() {
    this.searchFilter = {
      namNhap: '',
      soQd: '',
      soBienBan: '',
      ngayNhapDayKho: '',
    };
    this.tuNgayNhapDayKho = null;
    this.denNgayNhapDayKho = null;
    this.search();
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
          this.quanLyPhieuNhapDayKhoService.delete({ id: item.id }).then((res) => {
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
    if (id == 0 && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.isViewDetail = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh;
  }


  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          trangThai: STATUS.BAN_HANH,
          paggingReq: {
            "limit": this.pageSize,
            "page": this.page - 1
          },
          loaiVthh: this.loaiVthh,
          soQd: this.searchFilter.soQd,
          namNhap: this.searchFilter.namNhap,
          tuNgayNhapDayKho: this.tuNgayNhapDayKho != null ? dayjs(this.tuNgayNhapDayKho).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayNhapDayKho: this.denNgayNhapDayKho != null ? dayjs(this.denNgayNhapDayKho).format('YYYY-MM-DD') + " 24:59:59" : null,
          tuNgayTgianNkho: this.tuNgayTgianNkho != null ? dayjs(this.tuNgayTgianNkho).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayTgianNkho: this.denNgayTgianNkho != null ? dayjs(this.denNgayTgianNkho).format('YYYY-MM-DD') + " 24:59:59" : null,
        };
        this.quanLyPhieuNhapDayKhoService.export(body)
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
            let res = await this.quanLyPhieuNhapDayKhoService.deleteMuti({ ids: dataDelete });
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
      tenTrangThai: '',
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
    if (this.loaiVthh.startsWith('02')) {
      if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBKTNK_XEM') && data != null) {
        if(this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBKTNK_THEM') &&
          (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_LDCC
            || data.trangThai == STATUS.TU_CHOI_KT || data.trangThai == STATUS.TU_CHOI_KTVBQ)) {
          return false;
        } else if ((this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBKTNK_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC)
          || (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBKTNK_DUYET_KETOAN') && data.trangThai == STATUS.CHO_DUYET_KT)
          || (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBKTNK_DUYET_KTVBQ') && data.trangThai == STATUS.CHO_DUYET_KTVBQ)
        ) {
          return false;
        }
        return true;
      }
      return false;
    } else {
      if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_XEM') && data != null) {
        if(this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_THEM') &&
          (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_LDCC
          || data.trangThai == STATUS.TU_CHOI_KT || data.trangThai == STATUS.TU_CHOI_KTVBQ)) {
          return false;
        } else if ((this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC)
          || (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_KETOAN') && data.trangThai == STATUS.CHO_DUYET_KT)
          || (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_KTVBQ') && data.trangThai == STATUS.CHO_DUYET_KTVBQ)
        ) {
          return false;
        }
        return true;
      }
      return false;
    }
  }

  hienThiSua(data) {
    if (this.loaiVthh.startsWith('02')) {
      if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBKTNK_THEM') &&
        (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_LDCC
          || data.trangThai == STATUS.TU_CHOI_KT || data.trangThai == STATUS.TU_CHOI_KTVBQ)) {
        return true;
      }
    } else {
      if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_THEM') &&
        (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_LDCC
          || data.trangThai == STATUS.TU_CHOI_KT || data.trangThai == STATUS.TU_CHOI_KTVBQ)) {
        return true;
      }
    }
    return false;
  }

  hienThiDuyet(data){
    if (this.loaiVthh.startsWith('02')) {
      if ((this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBKTNK_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC)
        || (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBKTNK_DUYET_KETOAN') && data.trangThai == STATUS.CHO_DUYET_KT)
        || (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBKTNK_DUYET_KTVBQ') && data.trangThai == STATUS.CHO_DUYET_KTVBQ)
      ) {
        return true;
      }
    } else {
      if ((this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC)
        || (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_KETOAN') && data.trangThai == STATUS.CHO_DUYET_KT)
        || (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_LT_BBNDK_DUYET_KTVBQ') && data.trangThai == STATUS.CHO_DUYET_KTVBQ)
      ) {
        return true;
      }
    }
    return false;
  }

  disabledTuNgayNhapDayKho = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayNhapDayKho) {
      return false;
    }
    return startValue.getTime() > this.denNgayNhapDayKho.getTime();
  };

  disabledDenNgayNhapDayKho = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayNhapDayKho) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayNhapDayKho.getTime();
  };
  disabledTuNgayTgianNkho = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayTgianNkho) {
      return false;
    }
    return startValue.getTime() > this.denNgayTgianNkho.getTime();
  };

  disabledDenNgayTgianNkho = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayTgianNkho) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayTgianNkho.getTime();
  };
}
