import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import {
  LIST_VAT_TU_HANG_HOA,
  PAGE_SIZE_DEFAULT
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DeXuatKeHoachBanDauGiaService } from 'src/app/services/deXuatKeHoachBanDauGia.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-qd-phe-duyet-kh-ban-dau-gia',
  templateUrl: './qd-phe-duyet-kh-ban-dau-gia.component.html',
  styleUrls: ['./qd-phe-duyet-kh-ban-dau-gia.component.scss'],
})
export class QdPheDuyetKhBanDauGiaComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  @Input() loaiVthh: string;
  yearNow = dayjs().get('year');
  searchFilter = {
    soQd: null,
    loaiVthh: null,
    ngayTongHop: null,
    namKhoach: '',
    trichYeu: null,
    tuNgayTongHop: null,
    denNgayTongHOp: null,
  };
  filterTable: any = {
    soKeHoach: '',
    ngayKy: '',
    trichYeu: '',
    namKeHoach: '',
    tenLoaiHangHoa: '',
    tenCloaiVthh: '',
  };
  dataTableAll: any[] = [];
  isDetail: boolean = false;
  selectedId: number = 0;
  listVthh: any;
  listNam: any[] = [];
  startValue: Date | null = null;
  endValue: Date | null = null;
  //phê duyệt
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  //chưa phê quyệt
  totalRecordNo: number = 0;
  dataTableNo: any[] = [];

  tabSelected: string = 'quyet-dinh';
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: '' };

  lastBreadcrumb: string;
  userInfo: UserLogin;

  // selectedTab: string = 'phe-duyet';

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    public userService: UserService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.userInfo = this.userService.getUserLogin();
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.loadDanhMucHang();
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loadDanhMucHang() {
    this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        this.listOfMapData = hangHoa.data;
        this.listOfMapDataClone = [...this.listOfMapData];
        this.listOfMapData.forEach((item) => {
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });
      }
    });
  }

  insert() {
    this.isDetail = true;
    this.selectedId = null;
  }

  detail(data) {
    this.isDetail = true;
    this.selectedId = data.id;
  }

  delete(data?) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: MESSAGE.DELETE_CONFIRM,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: data.id,
            maDvi: null,
          };
          this.deXuatKeHoachBanDauGiaService
            .delete(body)
            .then(async (res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                await this.search();
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.DELETE_SUCCESS,
                );
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

  convertTreeToList(root: VatTu): VatTu[] {
    const stack: VatTu[] = [];
    const array: VatTu[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({
            ...node.child[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }
    return array;
  }

  visitNode(
    node: VatTu,
    hashMap: { [id: string]: boolean },
    array: VatTu[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  searchHangHoa(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.listOfMapData = this.listOfMapDataClone;
    } else {
      this.listOfMapData = this.listOfMapDataClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  selectHangHoa(vatTu: any) {
    this.selectHang = vatTu;
  }

  clearFilter() {
    this.startValue = null;
    this.endValue = null;
    this.selectHang = { ten: '' };
    this.searchFilter = {
      soQd: null,
      loaiVthh: null,
      ngayTongHop: null,
      namKhoach: null,
      trichYeu: null,
      tuNgayTongHop: null,
      denNgayTongHOp: null,
    };
  }

  async selectTabData(tab: string) {
    this.spinner.show();
    try {
      this.tabSelected = tab;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search() {
    this.spinner.show();
    let body = {
      ngayKyTuNgay: this.searchFilter.ngayTongHop ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD') : null,
      ngayKyDenNgay: this.searchFilter.ngayTongHop ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD') : null,
      soKeHoach: this.searchFilter.soQd,
      loaiVatTuHangHoa: this.searchFilter.loaiVthh,
      namKeHoach: this.searchFilter.namKhoach,
      trichYeu: this.searchFilter.trichYeu,
      trangThai: '02',
      maDvis: this.userInfo.MA_DVI,
      pageNumber: this.page,
      pageSize: this.pageSize,
    };
    let res = await this.deXuatKeHoachBanDauGiaService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
          item.tenTrangThai = this.convertTrangThai(item.trangThai);
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  showList() {
    this.isDetail = false;
    this.search();
  }

  convertTrangThaiTable(status: string) {
    return convertTrangThai(status);
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayKyTuNgay: this.searchFilter.ngayTongHop ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD') : null,
          ngayKyDenNgay: this.searchFilter.ngayTongHop ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD') : null,
          soKeHoach: this.searchFilter.soQd,
          loaiVatTuHangHoa: this.searchFilter.loaiVthh,
          namKeHoach: this.searchFilter.namKhoach,
          trichYeu: this.searchFilter.trichYeu,
          maDvis: [this.userInfo.MA_DVI],
          paggingReq: null,
        };
        this.deXuatKeHoachBanDauGiaService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(
              blob,
              'danh-sach-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.xlsx',
            ),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
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
            // let res = await this.deXuatDieuChinhService.deleteMultiple({ ids: dataDelete });
            // if (res.msg == MESSAGE.SUCCESS) {
            //   this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            //   await this.search();
            // } else {
            //   this.notification.error(MESSAGE.ERROR, res.msg);
            // }
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
      soKeHoach: '',
      ngayKy: '',
      trichYeu: '',
      namKeHoach: '',
      tenLoaiHangHoa: '',
      tenCloaiVthh: '',
    };
  }

  convertTrangThai(status: string) {
    switch (status) {
      case '00': {
        return 'Dự thảo';
      }
      case '03': {
        return 'Từ chối - TP';
      }
      case '12': {
        return 'Từ chối - LĐ Cục';
      }
      case '01': {
        return 'Chờ duyệt - TP';
      }
      case '09': {
        return 'Chờ duyệt - LĐ Cục';
      }
      case '02': {
        return 'Đã duyệt';
      }
      case '05': {
        return 'Tổng hợp';
      }
    }
  }
}
