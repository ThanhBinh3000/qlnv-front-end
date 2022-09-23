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
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
import {QuyHoachKhoService} from "../../../../../services/quy-hoach-kho.service";

@Component({
  selector: 'app-quyet-dinh-dieu-chinh-quy-hoach',
  templateUrl: './quyet-dinh-dieu-chinh-quy-hoach.component.html',
  styleUrls: ['./quyet-dinh-dieu-chinh-quy-hoach.component.scss']
})
export class QuyetDinhDieuChinhQuyHoachComponent implements OnInit {

  @Input() typeVthh: string;
  @Input() type: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  danhSachNam: any[] = [];
  danhSachPhuongAn: any[] = [];
  danhSachChiCuc: any[] = [];
  danhSachCuc: any[] = [];
  danhSachDiemKho: any[] = [];

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
    soQd: '',
    ngayQd: '',
    trichYeu: '',
    soQdGoc: '',
    namKhoach: '',
    tenVthh: '',
    soGoiThau: '',
    trangThai: '',
  };

  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyHoachKhoService: QuyHoachKhoService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.danhSachNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    console.log(
      this.dataTable
    )
  }

  async search() {
    this.spinner.show();
    let body = {
      ngayKyTu: this.searchFilter.ngayKy[0],
      ngayKyDen: this.searchFilter.ngayKy[1],
      soQuyetDinh: this.searchFilter.soQuyetDinh,
      namBatDau: this.searchFilter.namBatDau,
      namKetThuc: this.searchFilter.namKetThuc,
      maCuc: this.searchFilter.maCuc,
      maChiCuc: this.searchFilter.maChiCuc,
      maDiemKho: this.searchFilter.maDiemKho,
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


  async loadListPa() {
    this.danhSachPhuongAn = [];
    let res = await this.quyHoachKhoService.danhMucChungGetAll('PA_QUY_HOACH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachPhuongAn = res.data;
    }
  }

  async ongChangMaCuc(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.quyHoachKhoService.layDonViTheoCapDo(body);
    this.danhSachChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
  }

  async loadDanhSachChiCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.quyHoachKhoService.layDonViTheoCapDo(body);
    this.danhSachChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
  }


  async loadDanhSachCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.quyHoachKhoService.layDonViTheoCapDo(body);
    this.danhSachCuc = dsTong[DANH_MUC_LEVEL.CUC];
  }
  async loadDanhSachDiemKho() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.quyHoachKhoService.layDonViTheoCapDo(body);
    this.danhSachDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
  }



  async onChangChiCuc(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.quyHoachKhoService.layDonViTheoCapDo(body);
    this.danhSachDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
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
    this.filterTable = {
      soQd: '',
      ngayQd: '',
      trichYeu: '',
      soQdGoc: '',
      namKhoach: '',
      tenVthh: '',
      soGoiThau: '',
      trangThai: '',
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
            id: item.id,
            maDvi: '',
          };
          this.quyHoachKhoService.delete(body).then(async () => {
            this.notification.success(MESSAGE.ERROR, MESSAGE.DELETE_SUCCESS);
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
          "maCuc": this.searchFilter.maCuc,
          "maDiemKho": this.searchFilter.maDiemKho,
          "namBatDau":this.searchFilter.namBatDau,
          "ngayKyDen": this.searchFilter.ngayKy[1],
          "ngayKyTu": this.searchFilter.ngayKy[0],
          "namKetThuc": this.searchFilter.namKetThuc,
          "paggingReq": {
            "limit": 20,
            "page": 1
          },
          "phuongAnQuyHoach": this.searchFilter.phuongAnQuyHoach,
          "soQuyetDinh": this.searchFilter.soQuyetDinh,
          "type" : this.type
        }
        this.quyHoachKhoService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-dieu-chinh-quy-hoach-kho.xlsx'),
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

}
