import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopDeXuatKHBanDauGiaService } from 'src/app/services/tongHopDeXuatKHBanDauGia.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-tong-hop-de-xuat-kh-ban-dau-gia',
  templateUrl: './tong-hop-de-xuat-kh-ban-dau-gia.component.html',
  styleUrls: ['./tong-hop-de-xuat-kh-ban-dau-gia.component.scss'],
})
export class TongHopDeXuatKhBanDauGiaComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHBanDauGiaService: TongHopDeXuatKHBanDauGiaService,
    private modal: NzModalService,
    public userService: UserService,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private readonly danhMucService: DanhMucService,
    public globals: Globals,
  ) { }
  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;

  isDetail: boolean = false;
  listNam: any[] = [];
  dsLoaiHangHoa = [];
  yearNow: number = 0;
  searchFilter = {
    soDx: '',
    namKh: dayjs().get('year'),
    ngayTongHop: '',
    loaiVthh: '',
    noiDungTongHop: '',
  };
  filterTable: any = {
    maTongHop: '',
    ngayTongHop: '',
    noiDungTongHop: '',
    soQd: '',
    namKeHoach: '',
    tenVthh: '',
    soQdPheDuyet: '',
    statusConvert: '',
  };
  dataTableAll: any[] = [];
  listVthh: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  userInfo: UserLogin;
  selectedId: number = 0;

  isVatTu: boolean = false;

  allChecked = false;
  indeterminate = false;
  isView: boolean = false;

  async ngOnInit() {
    try {
      this.userInfo = this.userService.getUserLogin();
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.searchFilter.loaiVthh = this.loaiVthh;
      await this.loaiVTHHGetAll();
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiHangHoa = res.data;
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
      ngayTongHopTuNgay: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
        : null,
      ngayTongHopDenNgay: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
        : null,
      maVatTuCha: this.searchFilter.loaiVthh,
      namKeHoach: this.searchFilter.namKh,
      noiDungTongHop: this.searchFilter.noiDungTongHop,
      pageSize: this.pageSize,
      pageNumber: this.page,
    };
    let res = await this.tongHopDeXuatKHBanDauGiaService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
          item.soQdPheDuyet = item.qdPheDuyetKhbdg.soQuyetDinh;
          item.statusConvert = item.trangThai.name;
          item.status = item.trangThai.ma;
          item.tenVthh = item.vatTuCha.name;
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

  themMoi() {
    this.isDetail = true;
    if (this.userService.isTongCuc()) {
      this.isVatTu = true;
    } else {
      this.isVatTu = false;
    }
    this.selectedId = 0;
    this.loaiVthh = this.loaiVthhCache;
  }

  showList() {
    this.isDetail = false;
    this.search();
  }

  detail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.loaiVthh = data.loaiVthh;
    if (isView) {
      this.isView = isView;
    }
    if (data.loaiVthh.startsWith('02')) {
      this.isVatTu = true;
    } else {
      this.isVatTu = false;
    }
  }

  clearFilter() {
    this.searchFilter.namKh = dayjs().get('year');
    this.searchFilter.soDx = null;
    this.searchFilter.ngayTongHop = null;
    this.searchFilter.noiDungTongHop = null;
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
          this.tongHopDeXuatKHBanDauGiaService.xoa(item.id).then((res) => {
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

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          maDvis: this.userInfo.MA_DVI,
          ngayTongHopTuNgay: this.searchFilter.ngayTongHop
            ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
            : null,
          ngayTongHopDenNgay: this.searchFilter.ngayTongHop
            ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
            : null,
          maVatTuCha: this.searchFilter.loaiVthh,
          namKeHoach: this.searchFilter.namKh,
          noiDungTongHop: this.searchFilter.noiDungTongHop,
        };
        this.tongHopDeXuatKHBanDauGiaService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-tong-hop-de-xuat-ke-hoach-bdg.xlsx'),
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
            let res = await this.tongHopDeXuatKHBanDauGiaService.deleteMultiple({ ids: dataDelete });
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

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .indexOf(value.toString().toLowerCase()) != -1
          ) {
            temp.push(item);
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      maTongHop: '',
      ngayTongHop: '',
      noiDungTongHop: '',
      soQd: '',
      namKeHoach: '',
      tenVthh: '',
      soQdPheDuyet: '',
      statusConvert: '',
    };
  }
}
