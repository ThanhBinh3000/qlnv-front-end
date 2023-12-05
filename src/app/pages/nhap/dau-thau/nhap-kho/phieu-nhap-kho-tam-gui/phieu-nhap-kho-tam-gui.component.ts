import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/components/base/base.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { PhieuNhapKhoTamGuiService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/phieuNhapKhoTamGui.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import {Base2Component} from "../../../../../components/base2/base2.component";
@Component({
  selector: 'app-phieu-nhap-kho-tam-gui',
  templateUrl: './phieu-nhap-kho-tam-gui.component.html',
  styleUrls: ['./phieu-nhap-kho-tam-gui.component.scss']
})
export class PhieuNhapKhoTamGuiComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  qdTCDT: string = MESSAGE.QD_TCDT;

  searchFilter = {
    namKh: '',
    soPhieu: '',
    soQuyetDinh: '',
    // soBbGuiHang: ''
  };

  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;
  tuNgayNk: Date | null = null;
  denNgayNk: Date | null = null;

  filterTable: any = {
    soPhieu: '',
    soQuyetDinh: '',
    ngayNhapKho: '',
    diemKho: '',
    nhaKho: '',
    nganLo: '',
    trangThai: '',
  };

  constructor(
    httpClient: HttpClient,
    spinner: NgxSpinnerService,
    storageService: StorageService,
    notification: NzNotificationService,
    modal: NzModalService,
    private phieuNhapKhoTamGuiService: PhieuNhapKhoTamGuiService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNhapHangService);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
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

  disabledTuNgayNk = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayNk) {
      return false;
    }
    return startValue.getTime() > this.denNgayNk.getTime();
  };

  disabledDenNgayNk = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayNk) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayNk.getTime();
  };
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
      "ngayNhapKhoDen": this.denNgayNk != null ? dayjs(this.denNgayNk).format('YYYY-MM-DD') + " 24:59:59" : null,
      "ngayNhapKhoTu": this.tuNgayNk != null ? dayjs(this.tuNgayNk).format('YYYY-MM-DD') + " 00:00:00" : null,
      "soPhieu": this.searchFilter.soPhieu,
      "soQdNhap": this.searchFilter.soQuyetDinh,
      // "soBbGuiHang": this.searchFilter.soBbGuiHang,
      trangThai: this.STATUS.BAN_HANH,
      paggingReq: {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      "loaiVthh": this.loaiVthh
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
    for (let i = 0; i < this.dataTable.length; i++) {
      if (this.userService.isChiCuc()) {
        this.dataTable[i].detail = this.dataTable[i].dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
      } else {
        let data = [];
        this.dataTable[i].dtlList.forEach(item => {
          data = [...data, ...item.children];
        })
        this.dataTable[i].detail = {
          children: data
        }
      };
      this.expandSet.add(i)
    }
    // this.dataTable.forEach(item => {
    //   item.detail.children.forEach(ddNhap => {
    //     ddNhap.listPhieuNhapKho.forEach(x => {
    //       x.phieuKiemTraCl = ddNhap.listPhieuKtraCl.filter(item => item.soPhieu == x.soPhieuKtraCl)[0];
    //     });
    //   })
    // });
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
      namKh: '',
      soPhieu: '',
      // soBbGuiHang: '',
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
          this.phieuNhapKhoTamGuiService.delete({ id: item.id }).then((res) => {
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

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "loaiVthh": this.loaiVthh,
          "maDvi": this.userInfo.MA_DVI,
          "ngayNhapKhoDen": this.denNgayNk != null ? dayjs(this.denNgayNk).format('YYYY-MM-DD') + " 24:59:59" : null,
          "ngayNhapKhoTu": this.tuNgayNk != null ? dayjs(this.tuNgayNk).format('YYYY-MM-DD') + " 00:00:00" : null,
          "orderBy": null,
          "orderDirection": null,
          "paggingReq": {
            "limit": 20,
            "orderBy": null,
            "orderType": null,
            "page": 0
          },
          "soPhieu": this.searchFilter.soPhieu,
          "soQdNhap": this.searchFilter.soQuyetDinh,
          // "soBbGuiHang": this.searchFilter.soBbGuiHang,
          "str": null,
          "trangThai": null
        };
        this.phieuNhapKhoTamGuiService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-phieu-nhap-kho-tam-gui.xlsx'),
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
            let res = await this.phieuNhapKhoTamGuiService.deleteMuti({ ids: dataDelete });
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
      soPhieu: '',
      soQuyetDinh: '',
      ngayNhapKho: '',
      diemKho: '',
      nhaKho: '',
      nganLo: '',
      trangThai: '',
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

}
