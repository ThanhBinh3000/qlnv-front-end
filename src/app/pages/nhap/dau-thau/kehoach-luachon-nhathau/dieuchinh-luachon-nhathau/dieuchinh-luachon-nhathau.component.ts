import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { DieuChinhQuyetDinhPdKhlcntService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { cloneDeep } from 'lodash';
import {STATUS} from "../../../../../constants/status";
@Component({
  selector: 'app-dieuchinh-luachon-nhathau',
  templateUrl: './dieuchinh-luachon-nhathau.component.html',
  styleUrls: ['./dieuchinh-luachon-nhathau.component.scss'],
})
export class DieuchinhLuachonNhathauComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string;
  isDetail: boolean = false;
  isDetailVt: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  tuNgayQd: Date | null = null;
  denNgayQd: Date | null = null;
  listTrangThai: any[] = [
    { ma: this.STATUS.DA_LAP, giaTri: 'Đã lập' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' }
  ];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dieuChinhQuyetDinhPdKhlcntService: DieuChinhQuyetDinhPdKhlcntService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dieuChinhQuyetDinhPdKhlcntService);
    super.ngOnInit()
    this.formData = this.fb.group({
      nam: [''],
      soQdDc: [''],
      trichYeu: [''],
      loaiVthh: [''],
      tuNgayQd: [''],
      denNgayQd: ['']
    });
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
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
      await this.checkPriceAdjust('xuất hàng');
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    if ((id == null || id == 0) && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.selectedId = id;
    if (this.loaiVthh.startsWith("02")) {
      this.isDetailVt = true;
    } else {
      this.isDetail = true;
    }
    this.isViewDetail = isView ?? false;
  }

  async showList() {
    this.isDetail = false;
    this.isDetailVt = false;
    await this.search();
  }
  async search() {
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.tuNgayQd = this.tuNgayQd != null ? dayjs(this.tuNgayQd).format('YYYY-MM-DD') + " 00:00:00" : null
      body.denNgayQd = this.denNgayQd != null ? dayjs(this.denNgayQd).format('YYYY-MM-DD') + " 23:59:59" : null
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.dieuChinhQuyetDinhPdKhlcntService.search(body);
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
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  clearFilter() {
    this.formData.patchValue({
      nam: null,
      soQdDc: null,
      trichYeu: null
    })
    this.tuNgayQd = null;
    this.denNgayQd = null;
    this.search();
  }

  filterInTable(key: string, value: string | Date) {
    if (value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }
    if (value && value != '') {
      this.dataTable = this.dataTableAll.filter((item) =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      );
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  disabledTuNgayQd = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayQd) {
      return false;
    }
    return startValue.getTime() > this.denNgayQd.getTime();
  };

  disabledDenNgayQd = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayQd) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayQd.getTime();
  };

  disableXem(trangThai) {
    switch (trangThai){
      case this.STATUS.DA_LAP: {
        if (this.userService.isAccessPermisson("NHDTQG_PTDT_DCKHLCNT_THEM")) {
          return false;
        } else if (this.userService.isAccessPermisson("NHDTQG_PTDT_DCKHLCNT_XEM")) {
          return true;
        }
        break;
      }
      case this.STATUS.CHO_DUYET_LDV: {
        if (this.userService.isAccessPermisson("NHDTQG_PTDT_DCKHLCNT_DUYET_LDVU")) {
          return false;
        } else if (this.userService.isAccessPermisson("NHDTQG_PTDT_DCKHLCNT_XEM")) {
          return true;
        }
        break;
      }
      case this.STATUS.BAN_HANH: {
        if (this.userService.isAccessPermisson("NHDTQG_PTDT_DCKHLCNT_XEM")) {
          return true;
        }
        break;
      }
    }
  }

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_PTDT_DCKHLCNT_XEM') && data != null) {
      if(this.userService.isAccessPermisson('NHDTQG_PTDT_DCKHLCNT_THEM')
        && (data.trangThai == STATUS.DA_LAP
          || data.trangThai == STATUS.TU_CHOI_LDV
          || data.trangThai == STATUS.TU_CHOI_LDTC
        )) {
        return false;
      } else if (this.userService.isAccessPermisson('NHDTQG_PTDT_DCKHLCNT_DUYET_LDVU') && data.trangThai == STATUS.CHO_DUYET_LDV) {
        return false;
      }
      return true;
    }
    return false;
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.STATUS.DA_LAP) {
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
}
