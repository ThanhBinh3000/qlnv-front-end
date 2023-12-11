import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserService} from 'src/app/services/user.service';
import {cloneDeep} from 'lodash';
import {saveAs} from 'file-saver';
import {QuyetDinhGiaTCDTNNService} from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import {ThongTinChungPag} from "../../../../../../models/DeXuatPhuongAnGia";
import {STATUS} from "../../../../../../constants/status";
import {Globals} from "../../../../../../shared/globals";
import {Router} from "@angular/router";
import {UserLogin} from "../../../../../../models/userlogin";

@Component({
  selector: 'app-quyet-dinh-gia-cua-tcdtnn',
  templateUrl: './quyet-dinh-gia-cua-tcdtnn.component.html',
  styleUrls: ['./quyet-dinh-gia-cua-tcdtnn.component.scss']
})
export class QuyetDinhGiaCuaTcdtnnComponent implements OnInit {
  dataEditTtg: { [key: string]: { edit: boolean; data: ThongTinChungPag } } = {};
  @Input() pagType: string;
  @Input() type: string;
  @Output()
  getCount = new EventEmitter<any>();
  isAddNew = false;
  noEdit = false;
  formData: FormGroup;
  toDay = new Date();
  allChecked = false;
  listVthh: any[] = [];
  dsNam: string[] = [];
  dataTable: any[] = [];
  page: number = 1;
  dataTableAll: any[] = [];
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  pageSize: number = PAGE_SIZE_DEFAULT;
  indeterminate = false;
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  isViewDetail: boolean = false;
  idSelected: number = 0;
  STATUS = STATUS;
  userInfo: UserLogin
  listTrangThai = [
    {ma: this.STATUS.DU_THAO, giaTri: "Dự thảo"},
    {ma: this.STATUS.BAN_HANH, giaTri: "Ban hành"}
  ];

  constructor(private readonly fb: FormBuilder,
              private spinner: NgxSpinnerService,
              private notification: NzNotificationService,
              public userService: UserService,
              private modal: NzModalService,
              private router: Router,
              private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
              public globals: Globals
  ) {
    this.formData = this.fb.group({
      soQd: [null],
      ngayKyTu: [],
      ngayKyDen: [],
      trichYeu: [null],
      namKeHoach: [null],
      loaiVthh: [null],
      cloaiVthh: [null],
      loaiDeXuat: [null],
    });
  }

  filterTable: any = {
    soQd: '',
    ngayKyTu: '',
    ngayKyDen: '',
    trichYeu: '',
    namKeHoach: '',
    tenLoaiGia: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    tenTrangThai: '',
  };

  listLoaiDx= [
    {ma: "00", giaTri: "Lần đầu"},
    {ma: "01", giaTri: "Điều chỉnh"}
  ];

  async ngOnInit() {
    if ((this.pagType == 'LT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT_GCT_QDTC'))
      || (this.pagType == 'VT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_VT_GCT_QDTC'))) {
      this.router.navigateByUrl('/error/401')
    }
    this.userInfo = this.userService.getUserLogin();
    this.loadDsNam();
    this.search();
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
    }
  }

  clearFilter() {
    this.formData.reset();
    this.search();
  }

  async search() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.namKh = body.namKeHoach;
      body.pagType = this.pagType;
      body.maDvi = this.userService.isTongCuc() ? null : this.userInfo.MA_DVI;
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1,
      }
      let res = await this.quyetDinhGiaTCDTNNService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
        if (this.userService.isCuc()) {
          this.dataTable = this.dataTable.filter(item => item.trangThai == STATUS.BAN_HANH)
        }
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
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
            let res = await this.quyetDinhGiaTCDTNNService.deleteMuti({listId: dataDelete});
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
        body.pagType = this.pagType;
        this.quyetDinhGiaTCDTNNService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-gia-cua-tong-cuc-du-tru-nha-nuoc.xlsx'),
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
    this.noEdit = false;
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
          this.quyetDinhGiaTCDTNNService.delete({id: item.id}).then((res) => {
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

  filterInTable(key: string, value: string, type?: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (['ngayKy'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else {
            if (type) {
              if ('eq' == type) {
                if (item[key] && item[key].toString().toLowerCase() == value.toString().toLowerCase()) {
                  temp.push(item)
                }
              } else {
                if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                  temp.push(item)
                }
              }
            } else {
              if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                temp.push(item)
              }
            }
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
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

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }
}


