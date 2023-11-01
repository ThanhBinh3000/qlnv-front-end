import {
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { saveAs } from 'file-saver';
import { DieuChinhQuyetDinhPdKhmttService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/dieuchinh-khmtt/DieuChinhQuyetDinhPdKhmtt.service';
import {STATUS} from "../../../../../constants/status";
@Component({
  selector: 'app-dieuchinh-luachon-muatt',
  templateUrl: './dieuchinh-luachon-muatt.component.html',
  styleUrls: ['./dieuchinh-luachon-muatt.component.scss']
})
export class DieuchinhLuachonMuattComponent implements OnInit {
  @Input() typeVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  searchValue = '';
  listNam: any[] = [];
  STATUS = STATUS;

  searchFilter = {
    soQdDc: '',
    namKh: '',
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
          if (item.trangThai == STATUS.DA_LAP) {
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  clearFilter() {
    this.searchFilter = {
      soQdDc: '',
      namKh: '',
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
