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
@Component({
  selector: 'app-phieu-nhap-kho-tam-gui',
  templateUrl: './phieu-nhap-kho-tam-gui.component.html',
  styleUrls: ['./phieu-nhap-kho-tam-gui.component.scss']
})
export class PhieuNhapKhoTamGuiComponent extends BaseComponent implements OnInit {
  @Input() loaiVthh: string;

  qdTCDT: string = MESSAGE.QD_TCDT;

  searchFilter = {
    soPhieu: '',
    soQuyetDinh: '',
    ngayNhapKho: '',
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
    private httpClient: HttpClient,
    private storageService: StorageService,
    private phieuNhapKhoTamGuiService: PhieuNhapKhoTamGuiService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) {
    super(httpClient, storageService, quyetDinhGiaoNhapHangService);
    super.ngOnInit();
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
    // this.dataTable.forEach(item => {
    //   item.detail.children.forEach(ddNhap => {
    //     ddNhap.listPhieuNhapKho.forEach(x => {
    //       x.phieuKiemTraCl = ddNhap.listPhieuKtraCl.filter(item => item.soPhieu == x.soPhieuKtraCl)[0];
    //     });
    //   })
    // });
    console.log(this.dataTable);
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
      soQuyetDinh: '',
      ngayNhapKho: '',
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
          "ngayNhapKhoDen": this.searchFilter.ngayNhapKho && this.searchFilter.ngayNhapKho.length > 1
            ? dayjs(this.searchFilter.ngayNhapKho[1]).format('YYYY-MM-DD')
            : null,
          "ngayNhapKhoTu": this.searchFilter.ngayNhapKho && this.searchFilter.ngayNhapKho.length > 1
            ? dayjs(this.searchFilter.ngayNhapKho[0]).format('YYYY-MM-DD')
            : null,
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
