import {Component, OnChanges, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as dayjs from 'dayjs';
import {saveAs} from 'file-saver';
import {cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {LEVEL, LOAI_QD_CTKH, PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {DonviService} from 'src/app/services/donvi.service';
import {UserService} from 'src/app/services/user.service';
import {convertTrangThai} from 'src/app/shared/commonFunction';
import {Globals} from 'src/app/shared/globals';
import {STATUS} from "../../../../../constants/status";
import {DatePipe} from "@angular/common";
import print from 'print-js';
import printJS from "print-js";

@Component({
  selector: 'app-pa-giao-chi-tieu-ke-hoach',
  templateUrl: './pa-giao-chi-tieu-ke-hoach.component.html',
  styleUrls: ['./pa-giao-chi-tieu-ke-hoach.component.scss']
})
export class PaGiaoChiTieuKeHoachComponent implements OnInit {

  searchValue = '';
  searchFilter = {
    soQD: '',
    donViId: '',
    tenDonVi: '',
    trichYeu: '',
    namKeHoach: '',
  };
  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  STATUS = STATUS;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  listNam: any[] = [];
  lastBreadcrumb: string;
  userInfo: UserLogin;
  donViIdSearch: number;
  maDonViSearch: string;
  labelDonViSearch: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  allChecked = false;
  indeterminate = false;
  isViewDetail: boolean;
  countChiTieu = {
    chiTieuKeHoachNamTongCuc: 0,
    chiTieuKeHoachNamCuc: 0
  }
  capDvi: number = 1;
  filterTable: any = {
    soQd: '',
    ngayKy: '',
    namKeHoach: '',
    trichYeu: '',
    tenTrangThai: '',
  };
  indexTab: number = this.userService.isTongCuc() ? 0 : 1;
  LOAI_QD = LOAI_QD_CTKH;

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private notification: NzNotificationService,
    private donViService: DonviService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
  ) {
  }

  async ngOnInit() {
    this.selectTab(this.indexTab);
    await this.search();
    this.userInfo = this.userService.getUserLogin();
    if (this.userService.isTongCuc()) {
      this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
    } else if (this.userService.isChiCuc()) {
      this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      this.capDvi = 2;
    } else if (this.userService.isCuc()) {
      this.lastBreadcrumb = LEVEL.CUC_SHOW;
    }
    this.spinner.show();
    try {
      let dayNow = dayjs().get('year');
      for (let i = -3; i <= 5; i++) {
        this.listNam.push({
          value: dayNow + i,
          text: dayNow + i,
        });
      }
      const res = await this.donViService.layDonViCon();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
        this.options = cloneDeep(this.optionsDonVi);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      // this.getCount();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectThongTinChiTieuKeHoachNam(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async showList() {
    await this.search();
    this.isDetail = false;
    // await this.getCount();
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value.trim();
    if (value !== this.labelDonViSearch) {
      this.donViIdSearch = -1;
    }
    if (!value || value.indexOf('@') >= 0) {
      this.options = this.optionsDonVi;
      this.donViIdSearch = null;
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async search() {
    let maDonVi = null;
    let tenDvi = null;
    let donviId = null;
    if (this.inputDonVi && this.inputDonVi.length > 0) {
      let getDonVi = this.optionsDonVi.filter(
        (x) => x.labelDonVi == this.inputDonVi.trim(),
      );
      if (getDonVi && getDonVi.length > 0) {
        this.labelDonViSearch = this.inputDonVi;
        maDonVi = getDonVi[0].maDvi;
        tenDvi = getDonVi[0].tenDvi;
        donviId = getDonVi[0].id;
      }
    }
    let body = {
      capDvi: this.capDvi,
      ngayKyDenNgay: this.startValue
        ? dayjs(this.startValue[1]).format('YYYY-MM-DD')
        : null,
      id: 0,
      donViId: donviId ?? this.donViIdSearch,
      tenDvi: tenDvi,
      pageNumber: this.page,
      pageSize: this.pageSize,
      loaiQuyetDinh: this.LOAI_QD.PA,
      soQD: this.searchFilter.soQD,
      trichYeu: this.searchFilter.trichYeu,
      namKeHoach: this.searchFilter.namKeHoach,
      ngayKyTuNgay: this.startValue
        ? dayjs(this.startValue[0]).format('YYYY-MM-DD')
        : null,
    };
    let res = await this.chiTieuKeHoachNamService.timKiem(body);
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
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async getCount() {
    try {
      let res = await this.chiTieuKeHoachNamService.getCountChiTieu();
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.countChiTieu.chiTieuKeHoachNamCuc = res.data.chiTieuKeHoachNamCuc ?? 0;
          this.countChiTieu.chiTieuKeHoachNamTongCuc = res.data.chiTieuKeHoachNamTongCuc ?? 0;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
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

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  clearFilter() {
    this.searchFilter = {
      soQD: '',
      donViId: '',
      tenDonVi: '',
      trichYeu: '',
      namKeHoach: '',
    };
    this.startValue = null;
    this.endValue = null;
    this.inputDonVi = '';
    this.search();
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
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
          this.chiTieuKeHoachNamService.deleteData(item.id).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
              // this.getCount();
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

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let maDonVi = null;
        let tenDvi = null;
        if (this.inputDonVi && this.inputDonVi.length > 0) {
          let getDonVi = this.optionsDonVi.filter(
            (x) => x.labelDonVi == this.inputDonVi,
          );
          if (getDonVi && getDonVi.length > 0) {
            maDonVi = getDonVi[0].maDvi;
            tenDvi = getDonVi[0].tenDvi;
          }
        }
        let body = {
          ngayKyDenNgay: this.endValue
            ? dayjs(this.endValue).format('YYYY-MM-DD')
            : null,
          id: 0,
          donViId: maDonVi,
          tenDvi: tenDvi,
          pageNumber: null,
          pageSize: null,
          loaiQuyetDinh: this.LOAI_QD.PA,
          soQD: this.searchFilter.soQD,
          trichYeu: this.searchFilter.trichYeu,
          ngayKyTuNgay: this.startValue
            ? dayjs(this.startValue).format('YYYY-MM-DD')
            : null,
        };
        this.chiTieuKeHoachNamService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-phuong-an-chi-tieu-ke-hoach-nam.xlsx'),
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

  keyDownFunction(event) {
    if (event.keyCode === this.globals.prop.KEY_ENTER) {
      this.search();
    }
  }

  selectDonVi(donVi) {
    this.maDonViSearch = donVi.maDvi;
    this.labelDonViSearch = donVi.labelDonVi;
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
            let res = await this.chiTieuKeHoachNamService.deleteMultiple({ids: dataDelete});
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
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

  selectTab(cap: number) {
    this.capDvi = cap + 1;
    this.indexTab = cap;
    this.clearFilter();
    this.clearFilterTable();
    // this.search();
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
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
      ngayKy: '',
      namKeHoach: '',
      trichYeu: '',
      tenTrangThai: '',
    }
  }

  async preview() {
    // let pipe = new DatePipe('en-US');
    // let body = this.formData.value;
    // body.reportTemplateRequest = this.reportTemplate;
    // body.listDsGthau = this.listDsGthau;
    // body.fileDinhKemReq = this.fileDinhKem;
    // body.tongMucDtBangChu = convertTienTobangChu(this.formData.get('tongMucDt').value)
    // body.tgianDthau = pipe.transform(body.tgianDthau, 'yyyy-MM-dd HH:mm')
    // body.tgianMthau = pipe.transform(body.tgianMthau, 'yyyy-MM-dd HH:mm')
    // await this.dauThauService.preview(body).then(async s => {
    //   console.log(s)
    //   this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
    //   this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
    //   this.showDlgPreview = true;
    // });
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
          field: 'namKeHoach',
          displayName: 'Năm kế hoạch',
          columnSize: '100px'
        }
        ,
        {
          field: 'ngayKy',
          displayName: 'Ngày ký',
          columnSize: '100px'
        },
        {
          field: 'trichYeu',
          displayName: 'Trích yếu',
          columnSize: 'calc(100% - calc( 40px + 100px + 100px + 100px)) px'
        },
        {
          field: 'trangThaiDuyet',
          displayName: 'Trạng thái',
          columnSize: '100px'
        }
      ],
      type: 'json',
      header: 'Danh sách chỉ tiêu kế hoạch năm'
    })
  }
}
