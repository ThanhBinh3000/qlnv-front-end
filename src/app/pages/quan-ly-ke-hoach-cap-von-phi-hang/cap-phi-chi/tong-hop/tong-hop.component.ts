import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  PAGE_SIZE_DEFAULT
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { TongHopDeNghiCapPhiService } from 'src/app/services/ke-hoach/von-phi/tongHopDeNghiCapPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {STATUS} from "../../../../constants/status";

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss'],
})
export class TongHopComponent implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  STATUS = STATUS

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐC' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Từ chối - LĐC' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Đã duyệt - LĐC' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ' },
    { ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt - LĐ Vụ' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LĐ Vụ' },
  ];

  isDetail: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;

  formData: FormGroup

  filterTable: any = {
    maTongHop: '',
    nam: '',
    ngayTongHop: '',
    tongTien: '',
    kinhPhiDaCap: '',
    ycCapThemPhi: '',
    tenTrangThai: '',
  };
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  listVthh: any[] = [];

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};

  selectedId: number = 0;

  isVatTu: boolean = false;

  allChecked = false;
  indeterminate = false;

  isView = false;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private donviService: DonviService,
    public globals: Globals,
    private tongHopDeNghiCapPhiService: TongHopDeNghiCapPhiService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    try {
      this.initForm()
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.initData();
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  initForm() {
    this.formData = this.fb.group({
      maTongHop: [null],
      nam: [null],
      ngayTongHop: [null],
    })
  }
  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.globals.prop.NHAP_DU_THAO) {
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
  // Đang lỗi API phần GET
  async search() {
    this.spinner.show();
    let body = {
      maTongHop: this.formData.value.maTongHop ? this.formData.value.maTongHop : "",
      nam: this.formData.value.nam ? this.formData.value.nam : "",
      ngayTongHopTuNgay: "",
      ngayTongHopDenNgay: "",
      pageNumber: this.page,
      pageSize: this.pageSize,
    };
    if (this.formData.value.ngayTongHop != null) {
      body.ngayTongHopTuNgay = this.formData.value.ngayTongHop ? dayjs(this.formData.value.ngayTongHop[0]).format('YYYY-MM-DD') : null,
        body.ngayTongHopDenNgay = this.formData.value.ngayTongHop ? dayjs(this.formData.value.ngayTongHop[1]).format('YYYY-MM-DD') : null
    }
    let res = await this.tongHopDeNghiCapPhiService.timKiem(body);
    console.log(res);

    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
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
    this.isDetail = true;
    this.isView = false;
    this.selectedId = 0;
  }

  showList() {
    this.isDetail = false;
    this.search();
  }

  detail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.isView = isView;
  }

  clearFilter() {
    this.formData.reset();
    this.filterTable = {
      maTongHop: '',
      nam: '',
      ngayTongHop: '',
      tongTien: '',
      kinhPhiDaCap: '',
      ycCapThem: '',
      tenTrangThai: '',
    };
    this.search();
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
          this.tongHopDeNghiCapPhiService.deleteData(item.id).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  convertTrangThai(status: string) {
    switch (status) {
      case '00': {
        return 'Dự thảo';
      }
      case '03': {
        return 'Từ chối - TP';
      }
      case '12': {
        return 'Từ chối - LĐ Cục';
      }
      case '01': {
        return 'Chờ duyệt - TP';
      }
      case '09': {
        return 'Chờ duyệt - LĐ Cục';
      }
      case '02': {
        return 'Đã duyệt';
      }
      case '05': {
        return 'Tổng hợp';
      }
    }
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          maTongHop: this.formData.value.maTongHop ? this.formData.value.maTongHop : "",
          nam: this.formData.value.nam ? this.formData.value.nam : "",
          thisngayTongHopTuNgay: "",
          ngayTongHopDenNgay: " ",
          pageNumber: this.page,
          pageSize: this.pageSize,
        };
        if (this.formData.value.ngayTongHop != null) {
          body.thisngayTongHopTuNgay = this.formData.value.ngayTongHop ? dayjs(this.formData.value.ngayTongHop[0]).format('YYYY-MM-DD') : null,
            body.ngayTongHopDenNgay = this.formData.value.ngayTongHop ? dayjs(this.formData.value.ngayTongHop[1]).format('YYYY-MM-DD') : null
        }
        this.tongHopDeNghiCapPhiService.exportList(body).subscribe((blob) =>
          saveAs(blob, 'tong-hop-de-nghi-cap-von-chi.xlsx'),
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
  deleteSelect() {
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
            const body = {
              ids: dataDelete,
            };
            let res = await this.tongHopDeNghiCapPhiService.deleteMultiple(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    } else {
      this.notification.error(
        MESSAGE.ERROR,
        'Không có dữ liệu phù hợp để xóa.',
      );
    }
  }

  filterInTable(key: string, value: string, type?: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (['ngayKy', 'ngayLapKh', 'ngayDuyetLdcc', 'ngayGiaoNhan', 'ngayHieuLuc', 'ngayHetHieuLuc', 'ngayDeXuat', 'ngayTongHop', 'ngayTao', 'ngayQd', 'tgianNhang', 'tgianThien', 'ngayDx', 'ngayPduyet', 'ngayThop', 'thoiGianGiaoNhan', 'ngayKyQd', 'ngayNhanCgia', 'ngayKyDc', 'tgianGnhan', 'ngayDuyet'].includes(key)) {
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


  clearFilterTable() {
    this.filterTable = {
      maTongHop: '',
      nam: '',
      ngayTongHop: '',
      tongTien: '',
      kinhPhiDaCap: '',
      ycCapThemPhi: '',
      tenTrangThai: '',
    };
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }
}
