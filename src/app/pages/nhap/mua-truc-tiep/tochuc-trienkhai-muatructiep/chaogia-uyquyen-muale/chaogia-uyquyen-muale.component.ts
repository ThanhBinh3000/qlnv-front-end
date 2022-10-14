import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThaiGt, convertVthhToId } from 'src/app/shared/commonFunction';
import { saveAs } from 'file-saver';
import { STATUS } from 'src/app/constants/status';
import { TongHopDeXuatKHMTTService } from 'src/app/services/tong-hop-de-xuat-khmtt.service';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import { DanhSachMuaTrucTiep } from 'src/app/models/DeXuatKeHoachMuaTrucTiep';
@Component({
  selector: 'app-chaogia-uyquyen-muale',
  templateUrl: './chaogia-uyquyen-muale.component.html',
  styleUrls: ['./chaogia-uyquyen-muale.component.scss']
})
export class ChaogiaUyquyenMualeComponent implements OnInit {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHMTTService: TongHopDeXuatKHMTTService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
    private danhSachMuaTrucTiep: DanhSachDauThauService,
    private modal: NzModalService,
    public userService: UserService,
    private helperService: HelperService,
  ) {

  }
  @Input()
  loaiVthh: string;
  searchValue = '';
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  STATUS = STATUS
  searchFilter = {
    namKh: dayjs().get('year'),
    ngayHluc: '',
    canhanTochuc: '',
    loaiVthh: '',
    maDvi: '',

  };

  filterTable: any = {
    soQdPduyet: '',
    tenDvi: '',
    namKh: '',
    pthucMuatt: '',
    ngayHluc: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    tenTrangThaiTkhai: '',

  };

  dataTableAll: any[] = [];
  listVthh: any[] = [];
  allChecked = false;
  indeterminate = false;
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  lastBreadcrumb: string;
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  async ngOnInit() {
    await this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    try {
      this.userInfo = this.userService.getUserLogin();
      this.getTitleVthh();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await this.search();
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  getTitleVthh() {
    let loatVthh = this.router.url.split('/')[4]
    this.searchFilter.loaiVthh = convertVthhToId(loatVthh);
  }

  async search() {
    this.dataTable = [];
    let body = {
      ngayCgiaTu: this.searchFilter.ngayHluc
        ? dayjs(this.searchFilter.ngayHluc[0]).format('YYYY-MM-DD')
        : null,
      ngayCgiadDen: this.searchFilter.ngayHluc
        ? dayjs(this.searchFilter.ngayHluc[1]).format('YYYY-MM-DD')
        : null,
      loaiVthh: this.searchFilter.loaiVthh,
      namKh: this.searchFilter.namKh,
      canhanTochuc: this.searchFilter.canhanTochuc,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      maDvi: this.userInfo.MA_DVI
    };
    let res = await this.chaogiaUyquyenMualeService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (data && data.content && data.content.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable)
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  searchDanhSachDauThau(body, trangThai) {
    body.trangThai = trangThai
    return this.danhSachMuaTrucTiep.search(body);
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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number) {
    this.selectedId = id;
    this.isDetail = true;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  clearFilter() {
    this.searchFilter.namKh = dayjs().get('year');
    this.searchFilter.canhanTochuc = null;
    this.searchFilter.ngayHluc = null;
    this.searchFilter.maDvi = null;
    this.searchFilter.loaiVthh = null;
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
          let body = {
            "id": item.id,
            "maDvi": ""
          }
          this.tongHopDeXuatKHMTTService.delete(body).then(async () => {
            await this.search();
            this.spinner.hide();
          });
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  convertDay(day: string) {
    if (day && day.length > 0) {
      return dayjs(day).format('DD/MM/YYYY');
    }
    return '';
  }

  statusGoiThau(status: string) {
    return convertTrangThaiGt(status);
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayCgiaTu: this.searchFilter.ngayHluc
            ? dayjs(this.searchFilter.ngayHluc[0]).format('YYYY-MM-DD')
            : null,
          ngayCgiadDen: this.searchFilter.ngayHluc
            ? dayjs(this.searchFilter.ngayHluc[1]).format('YYYY-MM-DD')
            : null,
          loaiVthh: this.searchFilter.loaiVthh,
          namKh: this.searchFilter.namKh,
          canhanTochuc: this.searchFilter.canhanTochuc,
          maDvi: this.userInfo.MA_DVI,
        }
        this.chaogiaUyquyenMualeService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-tong-hop-ke-hoach-lcnt.xlsx'),
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

  dateChange() {
    this.helperService.formatDate()
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai !== STATUS.TRUNG_THAU) {
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

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
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
      soQdPduyet: '',
      tenDvi: '',
      namKh: '',
      pthucMuatt: '',
      ngayHluc: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThaiTkhai: '',
    }
  }
}
