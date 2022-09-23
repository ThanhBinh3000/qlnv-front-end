import { saveAs } from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT,
} from 'src/app/constants/config';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DeXuatKeHoachBanDauGiaService } from 'src/app/services/deXuatKeHoachBanDauGia.service';
import { UserService } from 'src/app/services/user.service';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { Globals } from 'src/app/shared/globals';
import { ThongTriDuyetYCapPhiService } from 'src/app/services/ke-hoach/von-phi/thongTriDuyetYCapPhi.service';

@Component({
  selector: 'app-thong-tri-duyet-y-du-toan',
  templateUrl: './thong-tri-duyet-y-du-toan.component.html',
  styleUrls: ['./thong-tri-duyet-y-du-toan.component.scss']
})
export class ThongTriDuyetYDuToanComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private thongTriDuyetYCapPhiService: ThongTriDuyetYCapPhiService,
    private modal: NzModalService,
    public userService: UserService,
    private donviService: DonviService,
    public globals: Globals,
  ) { }
  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;


  isDetail: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  searchFilter = {
    soThongChi: null,
    tenDvi: null,
    namKh: dayjs().get('year'),
    ngayKy: null,
    lyDoChi: null,
  };
  filterTable: any = {
    soThongTri: '',
    nam: '',
    ngayLap: '',
    lyDoChi: '',
    soDnCapPhi: '',
    tenTrangThai: '',
  };
  dataTableAll: any[] = [];
  listVthh: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};

  selectedId: number = 0;

  isVatTu: boolean = false;

  allChecked = false;
  indeterminate = false;

  isView = false;

  async ngOnInit() {
    try {
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.initData()
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
      "tuNgay": this.searchFilter.ngayKy ? dayjs(this.searchFilter.ngayKy[0]).format('YYYY-MM-DD') : null,
      "denNgay": this.searchFilter.ngayKy ? dayjs(this.searchFilter.ngayKy[1]).format('YYYY-MM-DD') : null,
      "maDvis": [
        this.userInfo.MA_DVI
      ],
      "nam": this.searchFilter.namKh,
      "soThongTri": this.searchFilter.soThongChi,
      "lyDoChi": this.searchFilter.lyDoChi,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1,
      },
    };
    let res = await this.thongTriDuyetYCapPhiService.timKiem(body);

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

  showList() {
    this.isDetail = false;
    this.search();
  }

  detail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.loaiVthh = data.loaiVthh;
    this.isView = isView;
  }

  clearFilter() {
    this.searchFilter = {
      soThongChi: null,
      tenDvi: null,
      namKh: null,
      ngayKy: null,
      lyDoChi: null,
    }
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
          this.thongTriDuyetYCapPhiService.delete(item.id).then((res) => {
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

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "tuNgay": this.searchFilter.ngayKy ? dayjs(this.searchFilter.ngayKy[0]).format('YYYY-MM-DD') : null,
          "denNgay": this.searchFilter.ngayKy ? dayjs(this.searchFilter.ngayKy[1]).format('YYYY-MM-DD') : null,
          "maDvis": [
            this.userInfo.MA_DVI
          ],
          "nam": this.searchFilter.namKh,
          "soThongTri": this.searchFilter.soThongChi,
          "lyDoChi": this.searchFilter.lyDoChi,
        };
        this.thongTriDuyetYCapPhiService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-thong-tri-duyet-y-du-toan.xlsx'),
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
            const body = {
              ids: dataDelete
            }
            let res = await this.thongTriDuyetYCapPhiService.deleteMultiple(body);
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
      soThongTri: '',
      nam: '',
      ngayLap: '',
      lyDoChi: '',
      soDnCapPhi: '',
      tenTrangThai: '',
    };
  }
}
