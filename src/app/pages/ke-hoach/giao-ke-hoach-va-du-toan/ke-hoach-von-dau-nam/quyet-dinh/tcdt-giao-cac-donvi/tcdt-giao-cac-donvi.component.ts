import { Component, EventEmitter, OnInit } from '@angular/core';
import { Base2Component } from '../../../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MmDxChiCucService } from '../../../../../../services/mm-dx-chi-cuc.service';
import { FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { STATUS } from 'src/app/constants/status';
import { cloneDeep } from 'lodash';
import { PAGE_SIZE_DEFAULT } from '../../../../../../constants/config';
import { UserLogin } from '../../../../../../models/userlogin';
import { MESSAGE } from '../../../../../../constants/message';
import printJS from 'print-js';
import { QuyetDinhTCDTGiaoDonviService } from '../../../../../../services/quyetDinhTCDTGiaoDonvi.service';

@Component({
  selector: 'app-tcdt-giao-cac-donvi',
  templateUrl: './tcdt-giao-cac-donvi.component.html',
  styleUrls: ['./tcdt-giao-cac-donvi.component.scss'],
})
export class TcdtGiaoCacDonviComponent extends Base2Component implements OnInit {


  isAddNew = false;
  formData: FormGroup;
  toDay = new Date();
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  allChecked = false;
  indeterminate = false;
  getCount = new EventEmitter<any>();
  dsNam: any[] = [];
  searchInTable: any = {
    soQd: '',
    namQd: dayjs().get('year'),
    ngayQd: '',
    trichYeu: '',
  };
  filterTable: any = {
    soQd: '',
    namQd: '',
    ngayQd: '',
    trichYeu: '',
    taiLieuDinhKem: '',
    tenTrangThai: '',
  };
  idSelected: number = 0;
  isView: boolean = false;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  listBoNganh: any[] = [];
  userInfo: UserLogin;
  STATUS = STATUS;
  rowSelected: number = 0;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhTCDTGiaoDonviService: QuyetDinhTCDTGiaoDonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhTCDTGiaoDonviService);
    super.ngOnInit();
    this.filterTable = {};
  }

  ngOnInit(): void {
    this.spinner.show();
    try {
      this.initForm();
      this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  initForm(): void {
    this.formData = this.fb.group({
      namQd: [],
      soQd: [],
      ngayQd: [[]],
      trichYeu: [null],
      trangThai: [],
      maDvi: [],
    });
  }

  initData() {

  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: thisYear + i,
        text: thisYear + i,
      });
    }
  }

  clearFilter() {
    this.formData.reset();
    this.search();
  }

  async search() {
    this.spinner.show();
    let body = this.formData.value;
    if (body.ngayQd != null) {
      body.ngayQdTu = body.ngayQd[0];
      body.ngayQdDen = body.ngayQd[1];
    }
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    };
    if (this.userService.isCuc()) {
      body.maDvi = this.userInfo.MA_DVI;
    }
    let res = await this.quyetDinhTCDTGiaoDonviService.search(body);
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
            let res = await this.quyetDinhTCDTGiaoDonviService.deleteMuti({ idList: dataDelete });
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
    } else {
      this.notification.error(MESSAGE.ERROR, 'Không có dữ liệu phù hợp để xóa.');
    }
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.tuNgay = body.ngayQd[0];
        body.denNgay = body.ngayQd[1];
        this.quyetDinhTCDTGiaoDonviService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-tcdt-giao-cac-donvi.xlsx'),
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


  async onClose() {
    this.isAddNew = false;
    await this.search();

  }

  onAllChecked(checked) {
    this.dataTable.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.allChecked = this.dataTable.every(({ id }) =>
      this.setOfCheckedId.has(id),
    );
    this.indeterminate =
      this.dataTable.some(({ id }) => this.setOfCheckedId.has(id)) &&
      !this.allChecked;
  }

  onItemChecked(id: number, checked) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
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
    this.idSelected = 0;
    this.isView = false;
    this.isAddNew = true;
  }

  viewDetail(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isView = isView ?? false;;
    this.isAddNew = true;
  }

  nzClickNodeTree(event: any): void {

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
          this.quyetDinhTCDTGiaoDonviService.delete({ id: item.id }).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
              this.getCount.emit();
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

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
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
      soQd: '',
      namQd: '',
      ngayQd: '',
      trichYeu: '',
      taiLieuDinhKem: '',
      tenTrangThai: '',
    };
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == STATUS.DANG_NHAP_DU_LIEU) {
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

  calcTong() {
    if (this.listBoNganh) {
      const sum = this.listBoNganh.reduce((prev, cur) => {
        prev += cur.tongSo;
        return prev;
      }, 0);
      return sum;
    }
  }

  print() {
    let dataPrint = this.dataTable.map((item, index) => {
      return {
        ...item,
        'stt': index + 1,
      };
    });
    printJS({
      printable: dataPrint,
      gridHeaderStyle: 'border: 2px solid #3971A5; ',
      gridStyle: 'border: 2px solid #3971A5;text-align:center;with:fit-content',
      properties: [
        {
          field: 'stt',
          displayName: 'STT',
          columnSize: '40px',
        },
        {
          field: 'soQd',
          displayName: 'Số quyết định',
          columnSize: '100px',
        }
        ,
        {
          field: 'namQd',
          displayName: 'Năm kế hoạch',
          columnSize: '100px',
        },
        {
          field: 'ngayQd',
          displayName: 'Ngày ký quyết định',
          columnSize: '100px',
        },
        {
          field: 'ngayQd',
          displayName: 'Ngày ký quyết định',
          columnSize: '100px',
        },
        {
          field: 'trichYeu',
          displayName: 'Trích yếu',
          columnSize: 'calc(100% - calc( 40px + 400px)) px',
        }, {
          field: 'tenTrangThai',
          displayName: 'Trạng thái',
          columnSize: '100px',
        },
      ],
      type: 'json',
      header: 'Danh sách quyết định của thủ tướng chính phủ',
    });
  }
}
