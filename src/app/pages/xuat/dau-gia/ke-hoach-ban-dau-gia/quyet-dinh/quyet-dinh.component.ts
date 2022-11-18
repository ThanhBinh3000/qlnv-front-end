import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import  dayjs  from 'dayjs';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from './../../../../../models/userlogin';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserService } from './../../../../../services/user.service';
import { DieuChinhQuyetDinhPdKhmttService } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/dieuchinh-khmtt/DieuChinhQuyetDinhPdKhmtt.service';
import { Globals } from './../../../../../shared/globals';
import { MESSAGE } from 'src/app/constants/message';
import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-quyet-dinh',
  templateUrl: './quyet-dinh.component.html',
  styleUrls: ['./quyet-dinh.component.scss']
})
export class QuyetDinhComponent implements OnInit {
  @Input()
  loaiVthhInput: string;
  @Input() typeVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  searchValue = '';
  listNam: any[] = [];

  searchFilter = {
    soQdDc: '',
    namKh: dayjs().get('year'),
    ngayKyDc: '',
    trichYeu: '',
  };

  filterTable: any = {
    namKh: '',
    soQdDc: '',
    ngayKyDc: '',
    soQdDcGoc: '',
    trichYeu: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    tenTrangThai: '',
  };

  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  getCount = new EventEmitter<any>();
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private DieuChinhQuyetDinhPdKhmttService: DieuChinhQuyetDinhPdKhmttService,
    public globals: Globals,
  ) { }

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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    console.log(
      this.dataTable
    )
  }

  async search() {
    this.spinner.show();
    let body = {
      ngayKyDcTu: this.searchFilter.ngayKyDc
        ? dayjs(this.searchFilter.ngayKyDc[0]).format('YYYY-MM-DD')
        : null,
      ngayKyDcDen: this.searchFilter.ngayKyDc
        ? dayjs(this.searchFilter.ngayKyDc[1]).format('YYYY-MM-DD')
        : null,
      soQdDc: this.searchFilter.soQdDc,
      namKh: this.searchFilter.namKh,
      trichYeu: this.searchFilter.trichYeu,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      maDvi: this.userInfo.MA_DVI
    };
    let res = await this.DieuChinhQuyetDinhPdKhmttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
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

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  convertTrangThai(status: string) {
    return this.convertTrangThai(status);
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  clearFilter() {
    this.searchFilter = {
      soQdDc: '',
      namKh: dayjs().get('year'),
      ngayKyDc: '',
      trichYeu: '',
    };
    this.search();
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
            let res = await this.DieuChinhQuyetDinhPdKhmttService.deleteMuti({ idList: dataDelete });
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
            id: item.id,
            maDvi: '',
          };
          this.DieuChinhQuyetDinhPdKhmttService.delete(body).then(async () => {
            await this.search();
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

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayKyDcTu: this.searchFilter.ngayKyDc
            ? dayjs(this.searchFilter.ngayKyDc[0]).format('YYYY-MM-DD')
            : null,
          ngayKyDcDen: this.searchFilter.ngayKyDc
            ? dayjs(this.searchFilter.ngayKyDc[1]).format('YYYY-MM-DD')
            : null,
          soQdDc: this.searchFilter.soQdDc,

          namKhoach: this.searchFilter.namKh,

        };
        this.DieuChinhQuyetDinhPdKhmttService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'dieu-chinh-ke-hoach-lcnn.xlsx'),
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
      namKhoach: '',
      soQdDc: '',
      ngayKyDc: '',
      soQdDcGoc: '',
      trichYeu: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      trangThai: '',
    };
  }

}
