import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserService} from 'src/app/services/user.service';
import {cloneDeep} from 'lodash';
import {QuyetDinhTtcpService} from 'src/app/services/quyetDinhTtcp.service';
import {saveAs} from 'file-saver';
import {NzModalService} from 'ng-zorro-antd/modal';
import {QuyetDinhUbtvqhMuaBuBoSungService} from "../../../../../../services/quyet-dinh-ubtvqh-mua-bu-bo-sung.service";
import {Globals} from "../../../../../../shared/globals";
import {STATUS} from "../../../../../../constants/status";


@Component({
  selector: 'app-ubtvqh-muabu',
  templateUrl: './ubtvqh-muabu.component.html',
  styleUrls: ['./ubtvqh-muabu.component.scss']
})
export class UbtvqhMuabuComponent implements OnInit {
  isAddNew = false;
  formData: FormGroup;
  toDay = new Date();
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  allChecked = false;
  indeterminate = false;
  getCount = new EventEmitter<any>();
  dsNam: string[] = [];
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
  isViewDetail: boolean = false;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  listBoNganh: any[] = [];
  namDataSelect: number;
  STATUS = STATUS;

  constructor(
    private readonly fb: FormBuilder,
    private quyetDinhUbtvqhMuBuBoSung: QuyetDinhUbtvqhMuaBuBoSungService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private modal: NzModalService,
    public globals: Globals,
  ) {
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

  async getDetailRow(id) {
    if (id) {
      let res = await this.quyetDinhUbtvqhMuBuBoSung.getDetail(id);
      this.listBoNganh = res.data.listBoNganh;
      this.namDataSelect = res.data.namQd
    }
  }

  calcTong() {
    if (this.listBoNganh) {
      const sum = this.listBoNganh.reduce((prev, cur) => {
        prev += cur.tongTien;
        return prev;
      }, 0);
      return sum;
    }
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i <= 5; i++) {
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
    let res = await this.quyetDinhUbtvqhMuBuBoSung.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
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
        if (item.trangThai == STATUS.DANG_NHAP_DU_LIEU) {
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
            console.log(dataDelete,'dataDeletedataDelete');return
            let res = await this.quyetDinhUbtvqhMuBuBoSung.deleteMuti({idList: dataDelete});
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
        body.ngayQdTu = body.ngayQd[0];
        body.ngayQdDen = body.ngayQd[1];
        this.quyetDinhUbtvqhMuBuBoSung
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-cua-ubtvqh.xlsx'),
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
    this.idSelected = null;
    if (this.isViewDetail == true) {
      this.isViewDetail = !this.isViewDetail
    }
    this.isAddNew = true;
  }

  async onClose() {
    this.isAddNew = false;
    await this.search()

  }

  onAllChecked(checked) {
    this.dataTable.forEach((item) => {
      if (item.trangThai == STATUS.DANG_NHAP_DU_LIEU) {
        this.updateCheckedSet(item.id, checked);
      }
    })
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
          this.quyetDinhUbtvqhMuBuBoSung.delete({id: item.id}).then((res) => {
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
      nam: '',
      ngayQd: '',
      trichYeu: '',
      taiLieuDinhKem: '',
      trangThai: '',
    }
  }

}
