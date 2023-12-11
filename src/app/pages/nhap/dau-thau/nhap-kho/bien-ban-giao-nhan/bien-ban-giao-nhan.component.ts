import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import {chain, cloneDeep } from 'lodash';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanKetThucNhapKho } from 'src/app/models/BienBanKetThucNhapKho';
import { UserLogin } from 'src/app/models/userlogin';
import { QuanLyBienBanGiaoNhanService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyBienBanGiaoNhan.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { StorageService } from 'src/app/services/storage.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from "../../../../../components/base2/base2.component";
import { STATUS } from 'src/app/constants/status';
@Component({
  selector: 'app-bien-ban-giao-nhan',
  templateUrl: './bien-ban-giao-nhan.component.html',
  styleUrls: ['./bien-ban-giao-nhan.component.scss']
})
export class BienBanGiaoNhanComponent extends Base2Component implements OnInit {
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
  STATUS = STATUS
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  allChecked = false;
  indeterminate = false;
  tuNgayKtnk: Date | null = null;
  denNgayKtnk: Date | null = null;
  tuNgayThoiHanNhap: Date | null = null;
  denNgayThoiHanNhap: Date | null = null;

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
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLyBienBanBanGiaoNhanService: QuanLyBienBanGiaoNhanService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyBienBanBanGiaoNhanService);
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
      tuNgayKtnk: this.tuNgayKtnk != null ? dayjs(this.tuNgayKtnk).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayKtnk: this.denNgayKtnk != null ? dayjs(this.denNgayKtnk).format('YYYY-MM-DD') + " 23:59:59" : null,
      tuNgayThoiHanNhap: this.tuNgayThoiHanNhap != null ? dayjs(this.tuNgayThoiHanNhap).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayThoiHanNhap: this.denNgayThoiHanNhap != null ? dayjs(this.denNgayThoiHanNhap).format('YYYY-MM-DD') + " 23:59:59": null,
      nam: this.searchFilter.nam,
      soQdGiaonvNh: this.searchFilter.soQuyetDinhNhap,
      soBienBan: this.searchFilter.soBienBan,
      trangThai: this.STATUS.BAN_HANH,
      paggingReq: {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.loaiVthh
    };
    let res = await this.quanLyBienBanBanGiaoNhanService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      for (let i = 0; i < this.dataTable.length; i++) {
        this.expandSet.add(i)
        this.dataTable[i].children = chain(this.dataTable[i].listBienBanGiaoNhan).groupBy("tenDiemKho").map((value, key) => (
          {
            tenDiemKho: key,
            children: value
          }))
          .value();
      }
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
    this.tuNgayKtnk = null;
    this.denNgayKtnk = null;
    this.tuNgayThoiHanNhap = null;
    this.denNgayThoiHanNhap = null;
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
          tuNgayKtnk: this.tuNgayKtnk != null ? dayjs(this.tuNgayKtnk).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayKtnk: this.denNgayKtnk != null ? dayjs(this.denNgayKtnk).format('YYYY-MM-DD') + " 23:59:59" : null,
          tuNgayThoiHanNhap: this.tuNgayThoiHanNhap != null ? dayjs(this.tuNgayThoiHanNhap).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayThoiHanNhap: this.denNgayThoiHanNhap != null ? dayjs(this.denNgayThoiHanNhap).format('YYYY-MM-DD') + " 23:59:59": null,
          nam: this.searchFilter.nam,
          soQdGiaonvNh: this.searchFilter.soQuyetDinhNhap,
          soBienBan: this.searchFilter.soBienBan,
          trangThai: this.STATUS.BAN_HANH,
          paggingReq: {
            "limit": this.pageSize,
            "page": this.page - 1
          },
          loaiVthh: this.loaiVthh
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
  disabledStartNgayKtnk = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayKtnk) {
      return startValue.getTime() > this.formData.value.denNgayKtnk.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayKtnk = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayKtnk) {
      return endValue.getTime() < this.formData.value.tuNgayKtnk.getTime();
    } else {
      return false;
    }
  };

  disabledStartNgayTHN = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayThoiHanNhap) {
      return startValue.getTime() > this.formData.value.denNgayThoiHanNhap.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayTHN = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayThoiHanNhap) {
      return endValue.getTime() < this.formData.value.tuNgayThoiHanNhap.getTime();
    } else {
      return false;
    }
  };

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBGN_XEM') && data != null) {
      if(this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBGN_THEM') && (data.trangThai == STATUS.DU_THAO
        || data.trangThai == STATUS.TU_CHOI_LDC)) {
        return false;
      } else if (this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BBGN_DUYET') && data.trangThai == STATUS.CHO_DUYET_LDC) {
        return false;
      }
      return true;
    }
    return false;
  }
}
