import {
  Component,
  Input,
  OnInit,
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
import {QuyHoachKhoService} from "../../../../../services/quy-hoach-kho.service";
import {DonviService} from "../../../../../services/donvi.service";
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import { Router } from "@angular/router";
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'app-quyet-dinh-quy-hoach-bk',
  templateUrl: './quyet-dinh-quy-hoach-bk.component.html',
  styleUrls: ['./quyet-dinh-quy-hoach-bk.component.scss']
})
export class QuyetDinhQuyHoachBkComponent implements OnInit {
  @Input() typeVthh: string;
  @Input() type: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  danhSachNam: any[] = [];
  dsTong: any = {};

  searchFilter = {
    soQuyetDinh: '',
    ngayKy: '',
    namBatDau: '',
    namKetThuc: '',
    phuongAnQuyHoach: '',
    maCuc: '',
    maChiCuc: '',
    maDiemKho: '',
  };

  filterTable: any = {
    soQuyetDinh: '',
    ngayKy: '',
    namBatDau: '',
    namKetThuc: '',
    namKhoach: '',
    trichYeu: '',
    soQdDc: '',
    tenTrangThai: '',
  };

  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  danhSachPhuongAn: any[] = [];
  danhSachChiCuc: any[] = [];
  danhSachCuc: any[] = [];
  danhSachDiemKho: any[] = [];
  status = STATUS

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyHoachKhoService: QuyHoachKhoService,
    private donViService: DonviService,
    private dmService: DanhMucService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_QHK_QDQH')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.loadDsNam();
      await this.search();
      await this.loadListPa();
      if (this.userService.isTongCuc()) {
        await this.loadDanhSachCuc();
      }
      if (this.userService.isCuc()) {
        await this.loadDanhSachChiCuc();
      }
      if (this.userService.isChiCuc()) {
        await this.loadDanhSachDiemKho();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loadDsNam() {
    for (let i = -10; i < 10; i++) {
      this.danhSachNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async loadListPa() {
    this.danhSachPhuongAn = [];
    let res = await this.dmService.danhMucChungGetAll('PA_QUY_HOACH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachPhuongAn = res.data;
    }
  }

  async ongChangMaCuc(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.danhSachChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    this.danhSachChiCuc = this.danhSachChiCuc.filter(item => item.type != "PB")
  }

  async loadDanhSachChiCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsTong = dsTong;
    this.danhSachChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    this.danhSachChiCuc = this.danhSachChiCuc.filter(item => item.type != "PB")
  }


  async loadDanhSachCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.danhSachCuc = dsTong[DANH_MUC_LEVEL.CUC];
    this.danhSachCuc = this.danhSachCuc.filter(item => item.type != "PB")
  }
  async loadDanhSachDiemKho() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.danhSachDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
    this.danhSachDiemKho = this.danhSachDiemKho.filter(item => item.type == "MLK")
  }



  async onChangChiCuc(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.danhSachDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
    this.danhSachDiemKho = this.danhSachDiemKho.filter(item => item.type == "MLK")
  }



  async search() {
    this.spinner.show();
    let body = {
      maDvi : this.userInfo.MA_DVI,
      ngayKyTu: this.searchFilter.ngayKy[0],
      ngayKyDen: this.searchFilter.ngayKy[1],
      soQuyetDinh: this.searchFilter.soQuyetDinh,
      namBatDau: this.searchFilter.namBatDau,
      namKetThuc: this.searchFilter.namKetThuc,
      maCuc: this.searchFilter.maCuc,
      maChiCuc: this.searchFilter.maChiCuc,
      maDiemKho: this.searchFilter.maDiemKho,
      phuongAnQuyHoach: this.searchFilter.phuongAnQuyHoach,
      type: this.type,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.quyHoachKhoService.search(body);
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
          if (item.trangThai == '78') {
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
      soQuyetDinh: '',
      ngayKy: '',
      namBatDau: '',
      namKetThuc: '',
      phuongAnQuyHoach: '',
      maCuc: '',
      maChiCuc: '',
      maDiemKho: '',
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
          let body = {
            id: item.id
          };
          this.quyHoachKhoService.delete(body).then(async () => {
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
          "maChiCuc": this.searchFilter.maChiCuc,
          "maDvi": this.userInfo.MA_DVI,
          "maCuc": this.searchFilter.maCuc,
          "maDiemKho": this.searchFilter.maDiemKho,
          "namBatDau": this.searchFilter.namBatDau,
          "ngayKyDen": this.searchFilter.ngayKy[1],
          "ngayKyTu": this.searchFilter.ngayKy[0],
          "namKetThuc": this.searchFilter.namKetThuc,
          "paggingReq": {
            "limit": 20,
            "page": 0
          },
          "phuongAnQuyHoach": this.searchFilter.phuongAnQuyHoach,
          "soQuyetDinh": this.searchFilter.soQuyetDinh,
          "type": this.type
        }
        this.quyHoachKhoService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-quy-hoach-kho.xlsx'),
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
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    }
    else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {

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
            let res = await this.quyHoachKhoService.deleteMuti({ ids: dataDelete });
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
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }



}
