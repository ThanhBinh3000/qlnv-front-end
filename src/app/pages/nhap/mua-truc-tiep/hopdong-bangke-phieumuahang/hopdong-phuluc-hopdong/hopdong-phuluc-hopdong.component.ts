import { cloneDeep } from 'lodash';
import { convertTenVthh } from 'src/app/shared/commonFunction';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DonviService } from 'src/app/services/donvi.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { Globals } from 'src/app/shared/globals';
import {
  ThongTinDauThauService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";
import { QuyetDinhPheDuyetKetQuaLCNTService } from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service";
import { STATUS } from "../../../../../constants/status";
import { BaseComponent } from 'src/app/components/base/base.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { HopdongPhulucHopdongService } from 'src/app/services/hopdong-phuluc-hopdong.service';


@Component({
  selector: 'app-hopdong-phuluc-hopdong',
  templateUrl: './hopdong-phuluc-hopdong.component.html',
  styleUrls: ['./hopdong-phuluc-hopdong.component.scss']
})
export class HopdongPhulucHopdongComponent extends BaseComponent implements OnInit {
  @Input() loaiVthh: String;

  searchFilter = {
    namHd: dayjs().get('year'),
    soHd: null,
    tenHd: null,
    maDvi: null,
    tenDvi: null,
    ngayKy: null,
  };

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};
  isDetail: boolean = false;
  isAddNew: boolean = false;
  isQuanLy: boolean = false;

  selectedId: number = 0;
  isView: boolean = false;
  allChecked = false;
  indeterminate = false;
  idChaoGia: number = 0;

  STATUS = STATUS;
  filterTable: any = {
    namHd: '',
    soQdPdKhMtt: '',
    soQdKqMtt: '',
    tgianNkho: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    tenTrangThai: '',

  };

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    public userService: UserService,
    private donViService: DonviService,

    private hopdongPhulucHopdongService: HopdongPhulucHopdongService,

  ) {
    super(httpClient, storageService, hopdongPhulucHopdongService);
  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      this.userInfo = this.userService.getUserLogin();
      console.log(this.loaiVthh);
      await this.loadDonVi();
      await this.search();
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

  async loadDonVi() {
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
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.optionsDonViShow = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
  }

  async search() {
    let body = {
      tuNgayKy: this.searchFilter.ngayKy
        ? dayjs(this.searchFilter.ngayKy[0]).format('YYYY-MM-DD')
        : null,
      denNgayKy: this.searchFilter.ngayKy
        ? dayjs(this.searchFilter.ngayKy[1]).format('YYYY-MM-DD')
        : null,
      namHd: this.searchFilter.namHd,
      soHd: this.searchFilter.soHd,
      tenHd: this.searchFilter.tenHd,
      tenDvi: this.searchFilter.tenDvi,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      maDvi: this.userService.isTongCuc() ? null : this.userInfo.MA_DVI,
    };
    let res = await this.hopdongPhulucHopdongService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
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
      nzOnOk: async () => {
        const body = {
          id: item.id,
        };
        let res = await this.hopdongPhulucHopdongService.delete(body);
        if (res.msg == MESSAGE.SUCCESS) {
          this.search();
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      },
    });
  }

  clearFilter() {
    this.searchFilter.namHd = null;
    this.searchFilter.soHd = null;
    this.searchFilter.tenHd = null;
    this.searchFilter.maDvi = null;
    this.searchFilter.tenDvi = null,
      this.searchFilter.ngayKy = null;
    this.search();
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  themMoi(isView: boolean, data: any) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.isAddNew = true;
    this.isQuanLy = false;
    this.isView = isView;
  }

  redirectToChiTiet(isView: boolean, data: any) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.isAddNew = false;
    this.isQuanLy = true;
    this.isView = isView;
    this.idChaoGia = data.idChaoGia;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  exportData() {

    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayKy: this.searchFilter.ngayKy
            ? dayjs(this.searchFilter.ngayKy[0]).format('YYYY-MM-DD')
            : null,
          denNgayKy: this.searchFilter.ngayKy
            ? dayjs(this.searchFilter.ngayKy[1]).format('YYYY-MM-DD')
            : null,
          namHd: this.searchFilter.namHd,
          soHd: this.searchFilter.soHd,
          tenHd: this.searchFilter.tenHd,
          tenDvi: this.searchFilter.tenDvi,
          maDvi: this.userService.isTongCuc() ? null : this.userInfo.MA_DVI,
        };
        this.hopdongPhulucHopdongService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.xlsx')
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
            let res = await this.hopdongPhulucHopdongService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.search();
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
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

  filterInTable(key: string, value: string) {
    if (value) {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toLowerCase()) !== -1) {
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
      namHd: '',
      soQdPdKhMtt: '',
      soQdKqMtt: '',
      tgianNkho: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',
    };
  }
}
