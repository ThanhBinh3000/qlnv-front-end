import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import dayjs from 'dayjs';
import {cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {UserService} from 'src/app/services/user.service';
import {convertTrangThai} from 'src/app/shared/commonFunction';
import {Globals} from 'src/app/shared/globals';
import {saveAs} from 'file-saver';
import {STATUS} from "../../../../../constants/status";
import {KtQdXdHangNamService} from "../../../../../services/kt-qd-xd-hang-nam.service";
import {KtTongHopXdHnService} from "../../../../../services/kt-tong-hop-xd-hn.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-khxd',
  templateUrl: './quyet-dinh-phe-duyet-khxd.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-khxd.component.scss']
})
export class QuyetDinhPheDuyetKhxdComponent implements OnInit {

  @Input() typeVthh: string;
  @Input() dataTongHop: any;
  @Output() removeData=new EventEmitter<any>();
  isDetail: boolean = false;

  STATUS = STATUS;
  selectedId: number = 0;
  idTongHop: number = 0;
  isViewTh : boolean;
  isViewDetail: boolean;
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  listNam: any[] = [];

  searchFilter = {
    namKeHoach  :'',
    soQuyetDinh: '',
    ngayKyTu: '',
    ngayKyDen: '',
    trichYeu: '',
  };

  filterTable: any = {
    namKeHoach: '',
    giaiDoan : '' ,
    soQuyetDinh: '',
    ngayKyBtc: '',
    soQdCanDieuChinh: '',
    soLanDieuChinh: '',
    trichYeu: '',
    phuongAnTc: '',
    tenTrangThai: '',
    trangThai: '',
  };

  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  dataTable: any[] = [];

  listTrangThai = [{"ma": "78", "giaTri": "Đang nhập dữ liệu"}, {"ma": "29", "giaTri": "Ban hành"}];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private router: Router,
    public userService: UserService,
    private quyetDinhService: KtQdXdHangNamService,
    public globals: Globals,
    private tongHopTrungHanService: KtTongHopXdHnService
  ) {
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHDTXDHANGNAM_QD')) {
      this.router.navigateByUrl('/error/401')
    }
    if(this.dataTongHop && this.dataTongHop.id >0){
      this.isDetail=this.dataTongHop.quyetDinh;
      this.idTongHop=this.dataTongHop.id;
    }
    this.removeData.emit()
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.loadDsNam();
      await this.search();
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

  async search() {
    this.spinner.show();
    let body = {
      namKeHoach : this.searchFilter.namKeHoach,
      soQuyetDinh : this.searchFilter.soQuyetDinh,
      ngayKyTu : this.searchFilter.ngayKyTu,
      ngayKyDen : this.searchFilter.ngayKyDen,
      trichYeu : this.searchFilter.trichYeu,
      maDvi : this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.quyetDinhService.search(body);
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

  clearFilter() {
    this.searchFilter = {
      namKeHoach  :'',
      soQuyetDinh: '',
      ngayKyTu: '',
      ngayKyDen: '',
      trichYeu: '',
    }
    this.search();
  }

  xoaItem(item) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            "id": item.id,
          }
          const res = await this.quyetDinhService.delete(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            await this.search();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
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
            let res = await this.quyetDinhService.deleteMuti({ids: dataDelete});
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


  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          namKeHoach : this.searchFilter.namKeHoach,
          soQuyetDinh : this.searchFilter.soQuyetDinh,
          ngayKyTu : this.searchFilter.ngayKyTu,
          ngayKyDen : this.searchFilter.ngayKyDen,
          trichYeu : this.searchFilter.trichYeu,
          maDvi : this.userInfo.MA_DVI,
          paggingReq: {
            limit: this.pageSize,
            page: this.page - 1,
          },
        };
        this.quyetDinhService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-phe-duyet-trung-han.xlsx'),
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
          if (['ngayKyBtc'].includes(key)) {
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

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  async openModalCttongHop(data : any) {
    let body = {
      namKeHoach : data.namKeHoach,
      paggingReq: {
        limit: 100,
        page: this.page - 1,
      }
    };
    let res = await this.tongHopTrungHanService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let listData = res.data.content;
      let result = listData.filter(item => item.soQuyetDinh == data.phuongAnTc);
      if (result && result.length > 0) {
        this.idTongHop = result[0].id;
        this.isViewTh = true;
      }
    }
  }

  closeDxPaModal() {
    this.idTongHop = null;
    this.isViewTh = false;
  }
}
