import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import {QuyetDinhBtcNganhService} from 'src/app/services/quyetDinhBtcNganh.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {UserService} from 'src/app/services/user.service';
import {MESSAGE} from 'src/app/constants/message';
import {cloneDeep} from 'lodash';
import {saveAs} from 'file-saver';
import {NzModalService} from 'ng-zorro-antd/modal';
import {KeHoachMuaXuat} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {STATUS} from "../../../../../../constants/status";
import printJS from "print-js";

@Component({
  selector: 'app-btc-giao-cac-bo-nganh',
  templateUrl: './btc-giao-cac-bo-nganh.component.html',
  styleUrls: ['./btc-giao-cac-bo-nganh.component.scss'],
})
export class BtcGiaoCacBoNganhComponent implements OnInit {
  @Output()
  getCount = new EventEmitter<any>();
  isAddNew = false;
  formData: FormGroup;
  toDay = new Date();
  allChecked = false;
  indeterminate = false;
  muaTangList: any[] = [];
  dsNam: string[] = [];
  STATUS = STATUS;
  searchInTable = {
    soQd: '',
    namQd: dayjs().get('year'),
    ngayQd: '',
    trichYeu: '',
  };
  filterTable: any = {
    soQd: '',
    ngayQd: '',
    tenBoNganh: '',
    trichYeu: '',
    tenTrangThai: '',
  };
  idSelected: number = 0;
  isViewDetail: boolean = false;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  rowSelected: number = 0;

  constructor(private readonly fb: FormBuilder,
              private quyetDinhBtcNganhService: QuyetDinhBtcNganhService,
              private spinner: NgxSpinnerService,
              private notification: NzNotificationService,
              public userService: UserService,
              private modal: NzModalService,
  ) {
    if (!userService.isAccessPermisson("KHVDTNSNN_GKHDT_VDNDT_QD_BTCBN")) {
      window.location.href = '/error/401'
    }
    this.formData = this.fb.group({
      namQd: [null],
      soQd: [null],
      ngayQd: [[]],
      trichYeu: [null],
    });
  }

  async ngOnInit() {
    this.loadDsNam();
    this.search();
  }

  initForm(): void {
  }

  initData() {

  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear + i).toString());
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

    }
    let res = await this.quyetDinhBtcNganhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
          // item.statusConvert = this.convertTrangThai(item.trangThai);
        });
        this.getDetailRow(this.dataTable[0].id)
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
            let res = await this.quyetDinhBtcNganhService.deleteMuti({idList: dataDelete});
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
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.tuNgay = body.ngayQd[0];
        body.denNgay = body.ngayQd[1];
        this.quyetDinhBtcNganhService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-bo-tai-chinh-giao-bo-nganh.xlsx'),
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

  themMoi() {
    this.idSelected = 0;
    this.isViewDetail = false;
    this.isAddNew = true;
  }

  async onClose() {
    this.isAddNew = false;
    await this.search()

  }

  onAllChecked(checked) {
    this.dataTable.forEach(({id}) => this.updateCheckedSet(id, checked));
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
    this.allChecked = this.dataTable.every(({id}) =>
      this.setOfCheckedId.has(id),
    );
    this.indeterminate =
      this.dataTable.some(({id}) => this.setOfCheckedId.has(id)) &&
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

  viewDetail(id: number, isViewDetail: boolean) {
    this.idSelected = id;
    this.isViewDetail = isViewDetail;
    this.isAddNew = true;
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
          this.quyetDinhBtcNganhService.delete({id: item.id}).then((res) => {
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
            temp.push(item)
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
      ngayQd: '',
      tenBoNganh: '',
      trichYeu: '',
      tenTrangThai: '',
    }
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

  async getDetailRow(id) {
    if (id) {
      let res = await this.quyetDinhBtcNganhService.getDetail(id);
      this.muaTangList = res.data.muaTangList;
      this.rowSelected = id;
    }
  }

  calcTong() {
    if (this.muaTangList) {
      const sum = this.muaTangList.reduce((prev, cur) => {
        prev += cur.sluongDtoan;
        return prev;
      }, 0);
      return sum;
    }
  }
  print() {
    let dataPrint = this.dataTable.map((item, index) => {
      return {
        ...item,
        'stt': index + 1
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
          columnSize: '40px'
        },
        {
          field: 'soQd',
          displayName: 'Số quyết định',
          columnSize: '100px'
        },
        {
          field: 'ngayQd',
          displayName: 'Ngày ký quyết định',
          columnSize: '100px'
        },
        {
          field: 'tenBoNganh',
          displayName: 'Tên bộ ngành',
          columnSize: '200px'
        },
        {
          field: 'trichYeu',
          displayName: 'Trích yếu',
          columnSize: 'calc(100% - calc( 40px + 500px)) px'
        }, {
          field: 'tenTrangThai',
          displayName: 'Trạng thái',
          columnSize: '100px'
        }
      ],
      type: 'json',
      header: 'Danh sách quyết định của bộ tài chính giao các bộ ngành'
    })
  }

}


