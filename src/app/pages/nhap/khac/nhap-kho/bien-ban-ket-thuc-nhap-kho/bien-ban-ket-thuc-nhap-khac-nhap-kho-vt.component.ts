import { QuanLyPhieuNhapDayKhoService } from './../../../../../services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapDayKho.service';
import { saveAs } from 'file-saver';
import { cloneDeep, chain } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { HttpClient } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
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
import { BienBanKetThucNhapKhacNhapKhoVatTuService } from './bien-ban-ket-thuc-nhap-khac-nhap-kho-vt.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-bien-ban-ket-thuc-nhap-khac-nhap-kho-vt',
  templateUrl: './bien-ban-ket-thuc-nhap-khac-nhap-kho-vt.component.html',
  styleUrls: ['./bien-ban-ket-thuc-nhap-khac-nhap-kho-vt.component.scss']
})
export class BienBanKetThucNhapKhacNhapKhoVatTuComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

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
  dataTableView: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private bienBanKetThucNhapKhacNhapKhoVatTuService: BienBanKetThucNhapKhacNhapKhoVatTuService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanKetThucNhapKhacNhapKhoVatTuService);
    this.formData = this.fb.group({
      nam: null,
      // loaiVthh: '02',
      soQdPdNk: null,
      soBb: null,
      tuNgayThoiHan: null,
      denNgayThoiHan: null,
      tuNgayNhapKho: null,
      denNgayNhapKho: null,
      tuNgayKtnk: null,
      denNgayKtnk: null
    })
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
      trangThai: STATUS.BAN_HANH,
      paggingReq: {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.loaiVthh
    };
    let res = await this.bienBanKetThucNhapKhacNhapKhoVatTuService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTableView = this.buildTableView(this.dataTable.map(f => ({ ...f, maLoNganKho: f.maLoKho ? `${f.maLoKho}${f.maNganKho}` : f.maNganKho })));
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }
  buildTableView(data: any[] = []) {
    let dataView = chain(data)
      .groupBy("soQdPdNk")
      ?.map((value1, key1) => {
        let children1 = chain(value1)
          .groupBy("maDiemKho")
          ?.map((value2, key2) => {
            let children2 = chain(value2)
              .groupBy("maLoNganKho")
              ?.map((value3, key3) => {
                const row3 = value3.find(s => s?.maLoNganKho == key3);
                if (!row3) return;
                return {
                  ...row3,
                  expand: true,
                  children: value3.filter(f => f.phieuNhapKhoId),
                }
              }
              ).value();

            let row2 = value2?.find(s => s.maDiemKho == key2);

            return {
              ...row2,
              expand: true,
              children: children2,
            }
          }
          ).value();


        let row1 = value1?.find(s => s.soQdPdNk === key1);
        return {
          ...row1,
          expand: true,
          children: children1,
        };
      }).value();

    return dataView
  }
  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
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
          this.bienBanKetThucNhapKhacNhapKhoVatTuService.delete({ id: item.id }).then((res) => {
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
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh;
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
        this.bienBanKetThucNhapKhacNhapKhoVatTuService.export(body)
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
            let res = await this.bienBanKetThucNhapKhacNhapKhoVatTuService.deleteMuti({ ids: dataDelete });
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

  disabledTuNgayNhapDayKho = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayThoiHan) {
      return startValue.getTime() > this.formData.value.denNgayThoiHan.getTime();
    }
    return false;
  }
  disabledDenNgayNhapDayKho = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tuNgayThoiHan) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.tuNgayThoiHan.getTime();
  }
  disabledTuNgayKetThucNhap = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayKtnk) {
      return startValue.getTime() > this.formData.value.denNgayKtnk.getTime();
    }
    return false;
  }
  disabledDenNgayKetThucNhap = (endValue: Date) => {
    if (!endValue || !this.formData.value.tuNgayKtnk) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.tuNgayKtnk.getTime();
  }
  print() {

  }
  checkRoleAdd() {
    return this.userService.isAccessPermisson('NHDTQG_NK_NK_VT_BBKTNK_THEM') && this.userService.isChiCuc();
  }
  checkRoleView(trangThai: STATUS): boolean {
    return this.userService.isAccessPermisson('NHDTQG_NK_NK_VT_BBKTNK_XEM') &&  trangThai && !this.checkRoleEdit(trangThai) && !this.checkRoleApprove(trangThai) && !this.checkRoleDelete(trangThai)
  }
  checkRoleEdit(trangThai: STATUS): boolean {
    return this.userService.isAccessPermisson('NHDTQG_NK_NK_VT_BBKTNK_THEM') &&  this.userService.isChiCuc() && [STATUS.DU_THAO, STATUS.TU_CHOI_LDCC].includes(trangThai)
  }
  checkRoleApprove(trangThai: STATUS): boolean {
    return this.userService.isChiCuc()
      && ((STATUS.CHO_DUYET_KTVBQ === trangThai && this.userService.isAccessPermisson('NHDTQG_NK_NK_VT_BBKTNK_DUYET_KTVBQ'))
      || (STATUS.CHO_DUYET_KT === trangThai && this.userService.isAccessPermisson('NHDTQG_NK_NK_VT_BBKTNK_DUYET_KETOAN'))
      || (STATUS.CHO_DUYET_LDCC === trangThai && this.userService.isAccessPermisson('NHDTQG_NK_NK_VT_BBKTNK_DUYET_LDCCUC')))
  }
  checkRoleDelete(trangThai: STATUS): boolean {
    return this.userService.isAccessPermisson('NHDTQG_NK_NK_VT_BBKTNK_XOA') && this.userService.isChiCuc() && STATUS.DU_THAO === trangThai
  }
}
