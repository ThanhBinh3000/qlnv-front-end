import {saveAs} from 'file-saver';
import {Component, Input, OnInit} from '@angular/core';
import dayjs from 'dayjs';
import {cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT,
} from 'src/app/constants/config';
import {DANH_MUC_LEVEL} from 'src/app/pages/luu-kho/luu-kho.constant';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {DeXuatKeHoachBanDauGiaService} from 'src/app/services/deXuatKeHoachBanDauGia.service';
import {UserService} from 'src/app/services/user.service';
import {DonviService} from 'src/app/services/donvi.service';
import {isEmpty} from 'lodash';
import {Globals} from 'src/app/shared/globals';
import {DeNghiCapVonBoNganhService} from 'src/app/services/ke-hoach/von-phi/deNghiCapVanBoNganh.service';
import {STATUS} from "../../../../constants/status";

@Component({
  selector: 'app-de-nghi-cap-von-bo-nganh',
  templateUrl: './de-nghi-cap-von-bo-nganh.component.html',
  styleUrls: ['./de-nghi-cap-von-bo-nganh.component.scss']
})
export class DeNghiCapVonBoNganhComponent implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  STATUS = STATUS;

  isDetail: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  searchFilter = {
    soKeHoach: null,
    maBoNganh: null,
    namKh: null,
    ngayDeNghiTuNgay: null,
    ngayDeNghiDenNgay: null
  };
  filterTable: any = {
    soDeNghi: '',
    tenBoNganh: '',
    ngayDeNghi: '',
    nam: '',
    tongTien: '',
    kinhPhiDaCap: '',
    ycCapThem: '',
    tenTrangThai: '',
  };
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];
  dataTableAll: any[] = [];
  dataTable: any[] = [];
  // listVthh: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  dsBoNganh: any[] = [];

  selectedId: number = 0;

  isVatTu: boolean = false;

  allChecked = false;
  indeterminate = false;

  isView = false;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private modal: NzModalService,
    public userService: UserService,
    private donviService: DonviService,
    public globals: Globals,
    private deNghiCapVonBoNganhService: DeNghiCapVonBoNganhService,
  ) {
  }

  async ngOnInit() {
    try {
      // this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.initData()
      await this.getListBoNganh();
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    const body = {
      maDviCha: this.userdetail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong[DANH_MUC_LEVEL.CUC];
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      // không lấy bộ tài chính
      this.dsBoNganh = res.data.filter(item => item.maDvi !== '01')
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
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  async search() {
    this.spinner.show();
    let body = {
      soDeNghi: this.searchFilter.soKeHoach,
      maBoNganh: this.searchFilter.maBoNganh,
      nam: this.searchFilter.namKh,
      ngayDeNghiTuNgay: this.searchFilter.ngayDeNghiTuNgay ?  dayjs(this.searchFilter.ngayDeNghiTuNgay).format('YYYY-MM-DD') : '',
      ngayDeNghiDenNgay: this.searchFilter.ngayDeNghiDenNgay ?   dayjs(this.searchFilter.ngayDeNghiDenNgay).format('YYYY-MM-DD') : '',
      pageNumber: this.page,
      pageSize: this.pageSize,
    };

    let res = await this.deNghiCapVonBoNganhService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
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
      if (this.page === 1) {
        await this.search();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // Hiện thị màn hình thêm mới
  themMoi() {
    this.isDetail = true;
    this.isView = false;
    if (this.userService.isTongCuc()) {
      this.isVatTu = true;
    } else {
      this.isVatTu = false;
    }
    this.selectedId = 0;
    this.loaiVthh = this.loaiVthhCache;
  }

  // Hàm truyền qua thêm mới
  showList() {
    this.isDetail = false;
    this.search();
  }

  // Hiện thị Edit, View
  detail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.loaiVthh = data.loaiVthh;
    this.isView = isView;
  }

  // Reset tìm kiếm
  clearFilter() {
    this.searchFilter = {
      soKeHoach: null,
      maBoNganh: null,
      namKh: null,
      ngayDeNghiDenNgay: null,
      ngayDeNghiTuNgay: null,
    };
    this.search();
  }

  // Xóa bản ghi
  xoaItem(id: any) {
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
          this.deNghiCapVonBoNganhService.deleteData(id).then((res) => {
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

  // Đang lỗi khi mở file excel
  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          soDeNghi: this.searchFilter.soKeHoach,
          maBoNganh: this.searchFilter.maBoNganh,
          nam: this.searchFilter.namKh,
          ngayDeNghiTuNgay: this.searchFilter.ngayDeNghiTuNgay ?  dayjs(this.searchFilter.ngayDeNghiTuNgay).format('YYYY-MM-DD') : '',
          ngayDeNghiDenNgay: this.searchFilter.ngayDeNghiDenNgay ?   dayjs(this.searchFilter.ngayDeNghiDenNgay).format('YYYY-MM-DD') : '',
          pageNumber: this.page,
          pageSize: this.pageSize,
        };
        this.deNghiCapVonBoNganhService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-de-nghi-cap-von-bo-nganh.xlsx')
        });
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

  // Xóa nhiều
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
            const body = {
              ids: dataDelete
            }

            let res = await this.deNghiCapVonBoNganhService.deleteMultiple(body);
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
    } else {
      this.notification.error(
        MESSAGE.ERROR,
        'Không có dữ liệu phù hợp để xóa.',
      );
    }
  }

  // Tìm kiếm trong bảng
  filterInTable(key: string, value: string, date: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (date) {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase() === dayjs(value).format('YYYY-MM-DD')) {
              temp.push(item)
            }
          });
        } else {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item)
            }
          });
        }
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

}
