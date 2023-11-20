import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { cloneDeep } from 'lodash';
import { QuyetDinhTtcpService } from 'src/app/services/quyetDinhTtcp.service';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserLogin } from './../../../../../../models/userlogin';
import { STATUS } from 'src/app/constants/status';
import printJS from 'print-js';


@Component({
  selector: 'app-ttcp',
  templateUrl: './ttcp.component.html',
  styleUrls: ['./ttcp.component.scss'],
})
export class TtcpComponent implements OnInit {
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
  isViewDetail: boolean = false;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  boTaiChinh: number = 100;
  listBoNganh: any[] = [];
  namDataSelect: number;
  userInfo: UserLogin;
  STATUS = STATUS;
  rowSelected: number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private quyetDinhTtcpService: QuyetDinhTtcpService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private modal: NzModalService,
  ) {
    if (!userService.isAccessPermisson('KHVDTNSNN_GKHDT_VDNDT_QD_TTCP')) {
      window.location.href = '/error/401';
    }
    this.formData = this.fb.group({
      namQd: [],
      soQd: [],
      ngayQd: [[]],
      trichYeu: [null],
      trangThai: [],
      maDvi: [],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
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
    let res = await this.quyetDinhTtcpService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
          // item.statusConvert = this.convertTrangThai(item.trangThai);
        });
        this.getDetailRow(this.dataTable[0].id);
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
            let res = await this.quyetDinhTtcpService.deleteMuti({ idList: dataDelete });
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

  // exportReportDemo() {
  //   let body = {
  //     typeFile: 'PDF',
  //     fileName: 'bc_nhap_xuat_ton_kho_hang_dtnn.jrxml',
  //     tenBaoCao: 'Hoa_test',
  //     nam: 2023,
  //   };
  //   this.quyetDinhTtcpService
  //     .exportReport(body)
  //     .subscribe((blob) =>
  //       saveAs(blob, body.tenBaoCao + '.pdf'),
  //     );
  // }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.tuNgay = body.ngayQd[0];
        body.denNgay = body.ngayQd[1];
        this.quyetDinhTtcpService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-thu-tuong-chinh-phu.xlsx'),
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
    this.isViewDetail = false;
    this.isAddNew = true;
  }

  viewDetail(id: number, isViewDetail: boolean) {
    this.idSelected = id;
    this.isViewDetail = isViewDetail;
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
          this.quyetDinhTtcpService.delete({ id: item.id }).then((res) => {
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

  async getDetailRow(id) {
    if (id) {
      let res = await this.quyetDinhTtcpService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBoNganh = res.data.listChiTangToanBoNganh ? res.data.listChiTangToanBoNganh : [];
        //gộp 2 dòng vt, lt thành btc
        const mergedItems: itemBn[] = this.listBoNganh.reduce((result: itemBn[], currentItem: itemBn) => {
          const lastIndex = result.length - 1;
          if (lastIndex >= 0 && result[lastIndex].maBn === currentItem.maBn) {
            result[lastIndex].tenBn = 'Bộ Tài Chính';
            result[lastIndex].tongSo += currentItem.tongSo;
          } else {
            result.push(currentItem);
          }
          return result;
        }, []);
        this.listBoNganh = cloneDeep(mergedItems.filter(item => item.tongSo));
        this.namDataSelect = res.data.namQd;
        this.rowSelected = id;
      }
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

interface itemBn {
  tenBn: string;
  maBn: string;
  tongSo: number;
}
