import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {chain, cloneDeep} from "lodash";
import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
import * as dayjs from "dayjs";
import {
  QuyetDinhGiaoNvNhapHangService
} from "../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserLogin} from "../../../../../models/userlogin";
import {UserService} from "../../../../../services/user.service";
import {STATUS} from "../../../../../constants/status";
import {PAGE_SIZE_DEFAULT} from "../../../../../constants/config";
import { saveAs } from 'file-saver';
import {
  MttHopDongPhuLucHdService
} from "../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttHopDongPhuLucHdService.service";


@Component({
  selector: 'app-hopdong-phuluc-hopdong',
  templateUrl: './hopdong-phuluc-hopdong.component.html',
  styleUrls: ['./hopdong-phuluc-hopdong.component.scss']
})
export class HopdongPhulucHopdongComponent implements OnInit {
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  isQuanLy: boolean;
  isAddNew: boolean;
  formData: FormGroup
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  userInfo: UserLogin;
  allChecked = false;
  indeterminate = false;
  filterTable = {
    namNhap: '',
    ngayKy: '',
    soQdPd: '',
    soQdKq: '',
    ngayMkho: '',
    loaiVthh: '',
    tenLoaiVthh: '',
    cloaiVthh: '',
    tenCloaiVthh: '',
    tenTrangThaiHd: '',
    tenTrangThaiXh: '',
  }
  idSelected: number
  isDetail: boolean
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  STATUS=STATUS
  listNam: any[] = [];
  tuNgayKy: Date | null = null;
  denNgayKy: Date | null = null;
  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private storageService: StorageService,
    private notification: NzNotificationService,
    public userService: UserService,
    private spinner: NgxSpinnerService,
    private modal: NzModalService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private thongTinPhuLucHopDongService: MttHopDongPhuLucHdService,
  ) {
    this.formData = this.fb.group({
      namNhap: null,
      soHd: null,
      tenHd: null,
      ngayKy: null,
      nhaCungCap: null,
      trangThai: null,
      loaiVthh: null,
      loaiQd: null,
      maDvi: null,
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.loaiVthh = '0101'
    this.spinner.show();
    console.log("ds hop dong", this.loaiVthh)
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      })
      await this.timKiem();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    if(!this.userService.isChiCuc()){
      this.formData.patchValue({
        trangThaiKq: STATUS.DA_DUYET_LDC,
        trangThaiQd: STATUS.BAN_HANH,
        loaiQd: '02',
      });
      await this.searchCuc();
    }else{
      this.formData.patchValue({
        trangThai: STATUS.BAN_HANH,
        loaiQd: '02'
      });
      await this.searchChiCuc();
    }
  }

  goDetail(id: number, roles?: any, isQuanLy?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isQuanLy = isQuanLy;
    this.isAddNew = !isQuanLy;
  }

  async searchChiCuc() {
    await this.spinner.show();
    try {
      let body = this.formData.value
      // body.namNhap = dayjs().get('year')
      body.tuNgayKy = this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null
      body.denNgayKy = this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
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

  async searchCuc() {
    await this.spinner.show();
    try {
      let body = this.formData.value
      // body.namNhap = dayjs().get('year')
      body.trangThaiKq = STATUS.DA_DUYET_LDC
      body.trangThaiQd = STATUS.BAN_HANH
      body.tuNgayKy = this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null
      body.denNgayKy = this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.thongTinPhuLucHopDongService.searchCuc(body);
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

  showList() {
    this.isDetail = false;
    this.timKiem();
    this.showListEvent.emit();
  }

  async changePageSize(event) {
    this.pageSize = event;
    await this.timKiem();
  }

  async changePageIndex(event) {
    this.page = event;
    await this.timKiem();
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

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.STATUS.DU_THAO) {
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

  exportData(fileName?: string) {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.quyetDinhPheDuyetKetQuaChaoGiaMTTService
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, fileName ? fileName : 'data.xlsx'),
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

  clearForm(currentSearch?: any) {
    this.formData.reset();
    if (currentSearch) {
      this.formData.patchValue(currentSearch)
    }
    this.tuNgayKy = null;
    this.denNgayKy  = null;
    this.timKiem();
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKy) {
      return false;
    }
    return startValue.getTime() > this.denNgayKy.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKy) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKy.getTime();
  };

}
