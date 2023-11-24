import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import * as dayjs from "dayjs";
import {PAGE_SIZE_DEFAULT} from "../../../../constants/config";
import {STATUS} from "../../../../constants/status";
import {MESSAGE} from "../../../../constants/message";
import {cloneDeep} from 'lodash';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Globals} from "../../../../shared/globals";
import {saveAs} from 'file-saver';
import {QuyetToanVonPhiService} from "../../../../services/ke-hoach/von-phi/quyetToanVonPhi.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UserService} from "../../../../services/user.service";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-du-lieu-tong-hop-tcdt',
  templateUrl: './du-lieu-tong-hop-tcdt.component.html',
  styleUrls: ['./du-lieu-tong-hop-tcdt.component.scss']
})
export class DuLieuTongHopTcdtComponent implements OnInit {
  isDetail: boolean = false;
  formData: FormGroup;
  dataTable: any[] = [];
  page: number = 1;
  dsNam: string[] = [];
  dataTableAll: any[] = [];
  allChecked = false;
  idSelected: number = 0;
  STATUS = STATUS;
  isViewDetail: boolean = false;
  totalRecord: number = 10;
  selectedId: number = 0;
  setOfCheckedId = new Set<number>();
  pageSize: number = PAGE_SIZE_DEFAULT;
  indeterminate = false;
  filterTable: any = {
    id: null,
    namQuyetToan: '',
    ngayNhap: '',
    ngayTao: '',
    ngayCapNhat: '',
    qdCtKhNam: '',
    trangThai: '',
    trangThaiPdBtc: '',
    soToTrinh: '',
  };
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDTC, giaTri: 'Chờ duyệt - LĐ Tổng Cục' },
    { ma: this.STATUS.DA_DUYET_LDTC, giaTri: 'Đã duyệt - LĐ Tổng Cục' },
    { ma: this.STATUS.TU_CHOI_LDTC, giaTri: 'Từ chối - LĐ Tổng Cục' },
  ];
  listTrangThaiBtc: any[] = [
    { ma: this.STATUS.CHODUYET_BTC, giaTri: 'Chờ duyệt - BTC' },
    { ma: this.STATUS.DADUYET_BTC, giaTri: 'Đã duyệt - BTC' },
    { ma: this.STATUS.TUCHOI_BTC, giaTri: 'Từ chối - BTC' },
  ];
  constructor(
    private readonly fb: FormBuilder,
    private notification: NzNotificationService,
    public globals: Globals,
    private vonPhiService: QuyetToanVonPhiService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    private modal: NzModalService,
  ) {
    this.formData = this.fb.group({
      namQt: [null],
      soToTrinh: [null],
      ngayTongHop: [[]],
      loai: '01',
    });
  }

  ngOnInit(): void {
    this.loadDsNam();
    this.search();
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear + i).toString());
    }
  }


  async search() {
    this.spinner.show();
    let body = this.formData.value;
    if (body.ngayTongHop != null) {
      body.ngayTaoTu = body.ngayTongHop[0];
      body.ngayTaoDen = body.ngayTongHop[1];
    }
    body.loai = '01';
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    }
    let res = await this.vonPhiService.search(body);
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearFilter() {
    this.formData.reset();
    this.search();
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
            let res = await this.vonPhiService.deleteMuti({ids: dataDelete});
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
          this.vonPhiService.delete({id: item.id}).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
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

  filterInTable(key: string, value: string, date: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (date) {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase().indexOf(dayjs(value).format('YYYY-MM-DD')) != -1 ) {
              temp.push(item);
            }
          });
        } else {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item);
            }
          });
        }
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  viewDetail(id: number, isViewDetail: boolean) {
    this.idSelected = id;
    this.isViewDetail = isViewDetail;
    this.isDetail = true;
  }

  showList() {
    this.isDetail = false;
    this.search();
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.ngayTaoTu = body.ngayTongHop[0];
        body.ngayTaoDen = body.ngayTongHop[1];
        body.loai = '01';
        this.vonPhiService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'du-lieu-tong-hop-tcdt.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

}
