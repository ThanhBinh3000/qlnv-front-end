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
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhGiaoNvNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { BienBanDayKhoMuaTrucTiepService } from 'src/app/services/bien-ban-day-kho-mua-truc-tiep.service';

@Component({
  selector: 'app-bien-ban-nhap-day-kho',
  templateUrl: './bien-ban-nhap-day-kho.component.html',
  styleUrls: ['./bien-ban-nhap-day-kho.component.scss']
})
export class BienBanNhapDayKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  searchFilter = {
    soQuyetDinhNhap: '',
    namKh: '',
    soBbNhapDayKho: '',
    ngayBdauNhap: '',
    ngayKthucNhap: '',
    ngayLapBban: '',
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
  tuNgayTao: Date | null = null;
  denNgayTao: Date | null = null;

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

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanDayKhoMuaTrucTiepService: BienBanDayKhoMuaTrucTiepService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanDayKhoMuaTrucTiepService);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
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
    // this.dataTable.forEach(item => {
    //   item.detail = item.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0];
    // });
    console.log(1)
    this.dataTable.forEach(item => {
      if (this.userService.isChiCuc()) {
        item.detail = item.hhBienBanDayKhoHdrList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
      } else {
        let data = [];
        item.hhBienBanDayKhoHdrList.forEach(item => {
          // data = [...data, ...item.listBienBanNhapDayKho];
        })
        item.detail = {
          // listBienBanNhapDayKho: data
        }
      };
    });
  }

  clearFilter() {
    this.searchFilter = {
      namKh: '',
      soQuyetDinhNhap: '',
      soBbNhapDayKho: '',
      ngayBdauNhap: '',
      ngayKthucNhap: '',
      ngayLapBban: '',
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
          this.bienBanDayKhoMuaTrucTiepService.delete({ id: item.id }).then((res) => {
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

  // async loadDiemKho() {
  //   let res = await this.tinhTrangKhoHienThoiService.getAllDiemKho();
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     if (res.data) {
  //       this.listDiemKho = res.data;
  //     }
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  // async loadNganKho() {
  //   let body = {
  //     "maNganKho": null,
  //     "nhaKhoId": null,
  //     "paggingReq": {
  //       "limit": 1000,
  //       "page": 1
  //     },
  //     "str": null,
  //     "tenNganKho": null,
  //     "trangThai": null
  //   };
  //   let res = await this.tinhTrangKhoHienThoiService.nganKhoGetList(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     if (res.data && res.data.content) {
  //       this.listNganKho = res.data.content;
  //     }
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  // async loadNganLo() {
  //   let body = {
  //     "maNganLo": null,
  //     "nganKhoId": null,
  //     "paggingReq": {
  //       "limit": 1000,
  //       "page": 1
  //     },
  //     "str": null,
  //     "tenNganLo": null,
  //     "trangThai": null
  //   };
  //   let res = await this.tinhTrangKhoHienThoiService.nganLoGetList(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     if (res.data && res.data.content) {
  //       this.listNganLo = res.data.content;
  //     }
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

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
          ngayBdauNhapTu: this.searchFilter.ngayBdauNhap
            ? dayjs(this.searchFilter.ngayBdauNhap[0]).format('YYYY-MM-DD')
            : null,
          ngayBdauNhapDen: this.searchFilter.ngayBdauNhap
            ? dayjs(this.searchFilter.ngayBdauNhap[1]).format('YYYY-MM-DD')
            : null,
          ngayKthucNhapTu: this.searchFilter.ngayKthucNhap
            ? dayjs(this.searchFilter.ngayKthucNhap[0]).format('YYYY-MM-DD')
            : null,
          ngayKthucNhapDen: this.searchFilter.ngayKthucNhap
            ? dayjs(this.searchFilter.ngayKthucNhap[1]).format('YYYY-MM-DD')
            : null,
          ngayLapBbanTu: this.searchFilter.ngayLapBban
            ? dayjs(this.searchFilter.ngayLapBban[0]).format('YYYY-MM-DD')
            : null,
          ngayLapBbanDen: this.searchFilter.ngayLapBban
            ? dayjs(this.searchFilter.ngayLapBban[1]).format('YYYY-MM-DD')
            : null,
          namKh: this.searchFilter.namKh,
          soQuyetDinhNhap: this.searchFilter.soQuyetDinhNhap,
          soBbNhapDayKho: this.searchFilter.soBbNhapDayKho,
        };
        this.bienBanDayKhoMuaTrucTiepService.export(body)
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
            let res = await this.bienBanDayKhoMuaTrucTiepService.deleteMuti({ ids: dataDelete });
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

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayTao) {
      return false;
    }
    return startValue.getTime() > this.denNgayTao.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayTao) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayTao.getTime();
  };
}
