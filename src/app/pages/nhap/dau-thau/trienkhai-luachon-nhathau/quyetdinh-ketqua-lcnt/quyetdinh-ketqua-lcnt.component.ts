import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai, convertTrangThaiGt, convertVthhToId } from 'src/app/shared/commonFunction';
import { saveAs } from 'file-saver';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-quyetdinh-ketqua-lcnt',
  templateUrl: './quyetdinh-ketqua-lcnt.component.html',
  styleUrls: ['./quyetdinh-ketqua-lcnt.component.scss']
})
export class QuyetdinhKetquaLcntComponent implements OnInit {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private modal: NzModalService,
    public userService: UserService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,
    private danhMucService: DanhMucService
  ) {

  }
  listNam: any[] = [];
  yearNow: number = 0;

  searchFilter = {
    soQdPdKhlcnt: '',
    soQdinh: '',
    namKhoach: dayjs().get('year'),
    ngayTongHop: '',
    loaiVthh: '',
    trichYeu: '',
    soGoiThau: ''
  };

  filterTable: any = {
    soQd: '',
    ngayTongHop: '',
    trichYeu: '',
    tenGthau: '',
    statusGT: '',
    tenNhaThau: '',
    lyDoHuy: '',
    donGiaTrcVat: '',
    tenHdong: '',
    tgianThienHd: '',
    statusConvert: '',
  };

  dataTableAll: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  allChecked = false;
  indeterminate = false;
  getCount = new EventEmitter<any>();
  listVthh: any[] = [];
  lastBreadcrumb: string;
  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  STATUS = STATUS;
  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      };
      this.getListVthh();
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getListVthh() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          element.count = 0;
          this.listVthh.push(element);
        });
      }
    }
  }

  async search() {
    let body = {
      tuNgayTao: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
        : null,
      denNgayTao: this.searchFilter.ngayTongHop
        ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
        : null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,

      },
      soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
      soQdinh: this.searchFilter.soQdinh,
      loaiVthh: this.searchFilter.loaiVthh,
      namKhoach: this.searchFilter.namKhoach,
      trichYeu: this.searchFilter.trichYeu,
      maDvi: this.userInfo.MA_DVI
    };
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.statusConvert = this.convertTrangThai(item.trangThai);
          item.statusGT = this.statusGoiThau(item.statusGthau);
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  clearFilter() {
    this.searchFilter.namKhoach = dayjs().get('year');
    this.searchFilter.trichYeu = null;
    this.searchFilter.loaiVthh = null;
    this.searchFilter.ngayTongHop = null;
    this.searchFilter.soQdPdKhlcnt = null;
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
          this.quyetDinhPheDuyetKetQuaLCNTService.delete(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
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

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  statusGoiThau(status: string) {
    return convertTrangThaiGt(status);
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayTao: this.searchFilter.ngayTongHop
            ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
            : null,
          denNgayTao: this.searchFilter.ngayTongHop
            ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
            : null,
          soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
          soQdinh: this.searchFilter.soQdinh,
          loaiVthh: this.searchFilter.loaiVthh,
          namKhoach: this.searchFilter.namKhoach

        };
        this.quyetDinhPheDuyetKetQuaLCNTService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-phe-duyet-ket0-qua-lcnt.xlsx'),
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

  xoa() {
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
            let res = await this.quyetDinhPheDuyetKetQuaLCNTService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.getCount.emit();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == '00') {
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
      soQd: '',
      ngayTongHop: '',
      trichYeu: '',
      tenGthau: '',
      statusGT: '',
      tenNhaThau: '',
      lyDoHuy: '',
      donGiaTrcVat: '',
      tenHdong: '',
      tgianThienHd: '',
      statusConvert: '',
    }
  }
}
