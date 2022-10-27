import { Component, EventEmitter, Input, OnInit } from '@angular/core';
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
import { HopdongPhulucHopdongService } from 'src/app/services/hopdong-phuluc-hopdong.service';
import { Globals } from 'src/app/shared/globals';


@Component({
  selector: 'app-hopdong-phuluc-hopdong',
  templateUrl: './hopdong-phuluc-hopdong.component.html',
  styleUrls: ['./hopdong-phuluc-hopdong.component.scss']
})
export class HopdongPhulucHopdongComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private modal: NzModalService,
    public userService: UserService,
    private hopdongPhulucHopdongService: HopdongPhulucHopdongService,
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) {

  }
  @Input()
  typeVthh: string;
  listNam: any[] = [];
  yearNow: number = 0;
  idMuaTt: number = 0;
  searchFilter = {
    namHd: dayjs().get('year'),
    soHdong: '',
    tenHdong: '',
    nhaCungCap: '',
    ngayKy: '',
  };

  filterTable: any = {
    namHd: '',
    soQdMtt: '',
    soQdCgia: '',
    tgianKthuc: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    tenTrangThaiHd: '',
    tentrangThaiNh: '',
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
  selectedId: number = 0;
  isViewDetail: boolean;
  STATUS = STATUS;
  isDetail: boolean = false;
  isAddNew: boolean = false;
  isQuanLy: boolean = false;
  isView: boolean = false;
  idQdMtt: number = 0;
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
      ngayKyHdTu: this.searchFilter.ngayKy
        ? dayjs(this.searchFilter.ngayKy[0]).format('YYYY-MM-DD')
        : null,
      ngayKyHdDen: this.searchFilter.ngayKy
        ? dayjs(this.searchFilter.ngayKy[1]).format('YYYY-MM-DD')
        : null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,

      },
      namHd: this.searchFilter.namHd,
      soHdong: this.searchFilter.soHdong,
      tenHdong: this.searchFilter.tenHdong,
      dviMua: this.searchFilter.nhaCungCap,
      maDvi: this.userInfo.MA_DVI
    };
    let res = await this.hopdongPhulucHopdongService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          // item.statusConvert = this.convertTrangThai(item.trangThai);
          // item.statusGT = this.statusGoiThau(item.statusGthau);
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  themMoi(isView: boolean, data: any) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.isAddNew = true;
    this.isQuanLy = false;
    this.isView = isView;
  }

  redirectToChiTiet(isView: boolean, data: any) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.isAddNew = false;
    this.isQuanLy = true;
    this.isView = isView;
    this.idQdMtt = data.idQdMtt;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  clearFilter() {
    this.searchFilter.namHd = dayjs().get('year');
    this.searchFilter.soHdong = null;
    this.searchFilter.tenHdong = null;
    this.searchFilter.ngayKy = null;
    this.searchFilter.nhaCungCap = null;
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
          this.hopdongPhulucHopdongService.delete(body).then(async (res) => {
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
          ngayKyHdTu: this.searchFilter.ngayKy
            ? dayjs(this.searchFilter.ngayKy[0]).format('YYYY-MM-DD')
            : null,
          ngayKyHdDen: this.searchFilter.ngayKy
            ? dayjs(this.searchFilter.ngayKy[1]).format('YYYY-MM-DD')
            : null,
          namHd: this.searchFilter.namHd,
          soHdong: this.searchFilter.soHdong,
          tenHdong: this.searchFilter.tenHdong,
          dviMua: this.searchFilter.nhaCungCap,
        };
        this.hopdongPhulucHopdongService
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
            let res = await this.hopdongPhulucHopdongService.deleteMuti({ idList: dataDelete });
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
          if (item.tenTrangThaiHd == '00') {
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
      namHd: '',
      soQdMtt: '',
      soQdCgia: '',
      tgianKthuc: '',
      tenLoaiVthhL: '',
      tenCloaiVthh: '',
      tenTrangThaiHd: '',
      tentrangThaiNh: '',
    }
  }
}

