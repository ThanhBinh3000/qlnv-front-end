
import {
  Component, EventEmitter,
  Input,
  OnInit, Output,
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
import {TongHopKhTrungHanService} from "../../../../../services/tong-hop-kh-trung-han.service";
import {STATUS} from "../../../../../constants/status";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import { KtTongHopXdHnService } from "../../../../../services/kt-tong-hop-xd-hn.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-tong-hop-dx-nhu-cau',
  templateUrl: './tong-hop-dx-nhu-cau.component.html',
  styleUrls: ['./tong-hop-dx-nhu-cau.component.scss']
})
export class TongHopDxNhuCauComponent implements OnInit {
  @Input() typeVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  listNam: any[] = [];
  listLoaiDuAn: any[] = [];
  STATUS = STATUS
  @Output() tabFocus: EventEmitter<number> = new EventEmitter<number>();
  searchFilter = {
    namKeHoach : '',
    maTongHop: '',
    tenDuAn: '',
    tgKhoiCong : '',
    tgHoanThanh : '',
    diaDiem: '',
    ngayTongHopTu: '',
    ngayTongHopDen: '',
    namBatDau: '',
    namKetThuc: '',
    trangThai  :'',
  };

  filterTable: any = {
    namKeHoach : '',
    giaiDoan : '',
    id : '',
    ngayTao : '',
    maToTrinh : '',
    soQuyetDinh : '',
    noiDung : '',
    trangThai : '',
  };

  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  openChiTiet: boolean;

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private notification: NzNotificationService,
    private tongHopDxXdTh: KtTongHopXdHnService,
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    public userService: UserService,
    public globals: Globals,
  ) { }

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LĐ Vụ' },
    { ma: this.STATUS.CHO_DUYET_LDTC, giaTri: 'Chờ duyệt - LĐ Tổng cục' },
    { ma: this.STATUS.TU_CHOI_LDTC, giaTri: 'Từ chối - LĐ Tổng cục' },
    { ma: this.STATUS.DA_DUYET_LDTC, giaTri: 'Đã duyệt - LĐ Tổng cục' },
  ];

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHDTXDHANGNAM_TH')) {
      this.router.navigateByUrl('/error/401')
    }
    // if(check){
    //   this.openQdPheDuyet()
    // }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await this.search();
      await this.getAllLoaiDuAn();
      this.loadDsNam();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async getAllLoaiDuAn() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiDuAn = res.data;
    }
  }

  async search() {
    this.spinner.show();
    let body = {
      namKeHoach : this.searchFilter.namKeHoach,
      diaDiem: this.searchFilter.diaDiem,
      tenDuAn: this.searchFilter.tenDuAn,
      maTongHop: this.searchFilter.maTongHop,
      ngayTongHopTu: this.searchFilter.ngayTongHopTu,
      ngayTongHopDen: this.searchFilter.ngayTongHopDen,
      namBatDau: this.searchFilter.namBatDau,
      namKetThuc: this.searchFilter.namKetThuc,
      tgKhoiCong : this.searchFilter.tgKhoiCong,
      tgHoanThanh : this.searchFilter.tgHoanThanh,
      trangThai : this.searchFilter.trangThai,
      maDvi : this.userService.isTongCuc() ? this.userInfo.MA_DVI : null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      }
    };
    let res = await this.tongHopDxXdTh.search(body);
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
    return convertTrangThai(status);
  }

  async showList() {
    this.isDetail = false;
    await this.search();
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
          this.tongHopDxXdTh.delete(body).then(async () => {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
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

        };
        this.tongHopDxXdTh
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'tong-hop-nhu-cau-hang-nam' +
              '.xlsx'),
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
          item.giaiDoan = item.namBatDau + ' - ' + item.namKetThuc
          if (['ngayTao'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else {
            if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item)
            }
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  async clearFilterTable() {
    this.searchFilter = {
      namKeHoach : '',
      maTongHop: '',
      tenDuAn: '',
      tgKhoiCong : '',
      tgHoanThanh : '',
      diaDiem: '',
      ngayTongHopTu: '',
      ngayTongHopDen: '',
      namBatDau: '',
      namKetThuc: '',
      trangThai  :'',
    };
    await this.search();
  }

  deleteMulti() {
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
            let res = await this.tongHopDxXdTh.deleteMuti({ids: dataDelete});
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
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
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  openChiTietModal(id: number) {
    this.selectedId = id;
    this.openChiTiet = true;
  }

  closeChiTietModal() {
    this.selectedId = null;
    this.openChiTiet = false;
  }
  receivedTab(tab) {
    if (tab) {
      this.emitTab(tab);
    }
  }
  emitTab(tab) {
    this.tabFocus.emit(tab);
  }
}
