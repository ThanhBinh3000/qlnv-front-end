import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThaiGt, convertVthhToId } from 'src/app/shared/commonFunction';
import { saveAs } from 'file-saver';
import { STATUS } from 'src/app/constants/status';
import {
  ThongTinDauThauService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { StorageService } from "../../../../../services/storage.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-thongtin-dauthau',
  templateUrl: './thongtin-dauthau.component.html',
  styleUrls: ['./thongtin-dauthau.component.scss']
})
export class ThongtinDauthauComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  constructor(
    private router: Router,
    spinner: NgxSpinnerService,
    notification: NzNotificationService,
    httpClient: HttpClient,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService: DanhSachDauThauService,
    storageService: StorageService,
    modal: NzModalService,
    userService: UserService,
    private thongTinDauThauService: ThongTinDauThauService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauThauService);
  }
  searchValue = '';
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  STATUS = STATUS
  isView: boolean = false;
  listTrangThai: any[] = [
    { ma: this.STATUS.DANG_CAP_NHAT, giaTri: 'Đang cập nhật' },
    { ma: this.STATUS.CHUA_CAP_NHAT, giaTri: 'Chưa cập nhật' },
    { ma: this.STATUS.HOAN_THANH_CAP_NHAT, giaTri: 'Hoàn thành cập nhật' }
  ];
  searchFilter = {
    namKhoach: '',
    soQd: '',
    ngayQd: '',
    loaiVthh: '',
    maDvi: '',
    trichYeu: '',
    soQdPdKhlcnt: '',
    soQdPdKqlcnt: ''
  };

  filterTable: any = {
    namKhoach: '',
    tenGthau: '',
    tenDvi: '',
    soQdPdKhlcnt: '',
    ngayQd: '',
    trichYeu: '',
    tenVthh: '',
    tenCloaiVthh: '',
    thanhGiaGoiThau: '',
    tenTrangThai: '',
    trangThai: ''
  };

  dataTableAll: any[] = [];
  listVthh: any[] = [];
  allChecked = false;
  tuNgayQd: Date | null = null;
  denNgayQd: Date | null = null;
  indeterminate = false;
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  lastBreadcrumb: string;
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;
  isDetail: boolean = false;
  isDetailVt: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  idDx: number = 0;
  soDx: string;
  openDxKhlcnt = false;
  idQdKq: number = 0;
  openQdKqKhlcnt = false;
  idQdPdKq: number = 0;
  soQdPdKq: string;
  openQdPdKqKhlcnt = false;

  async ngOnInit() {
    await this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    try {
      this.userInfo = this.userService.getUserLogin();
      this.getTitleVthh();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await this.search();
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  getTitleVthh() {
    let loatVthh = this.router.url.split('/')[4]
    this.searchFilter.loaiVthh = convertVthhToId(loatVthh);
  }

  disabledTuNgayKy = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayQd) {
      return false;
    }
    return startValue.getTime() > this.denNgayQd.getTime();
  };

  disabledDenNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayQd) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayQd.getTime();
  };

  async search() {
    this.dataTable = [];
    let body = {};
    if (this.loaiVthh.startsWith('02')) {
      body = {
        tuNgayQd: this.tuNgayQd != null ? dayjs(this.tuNgayQd).format('YYYY-MM-DD') + " 00:00:00" : null,
        denNgayQd: this.denNgayQd != null ? dayjs(this.denNgayQd).format('YYYY-MM-DD') + " 23:59:59" : null,
        loaiVthh: this.loaiVthh,
        namKhoach: this.searchFilter.namKhoach,
        soQd: this.searchFilter.soQd,
        soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
        soQdPdKqlcnt: this.searchFilter.soQdPdKqlcnt,
        trangThai: this.STATUS.BAN_HANH,
        lastest: 0,
        paggingReq: {
          limit: this.pageSize,
          page: this.page - 1,
        },
        // maDvi: this.userService.isTongCuc() ? '' : this.userInfo.MA_DVI
      };
    } else {
      body = {
        tuNgayQd: this.tuNgayQd != null ? dayjs(this.tuNgayQd).format('YYYY-MM-DD') + " 00:00:00" : null,
        denNgayQd: this.denNgayQd != null ? dayjs(this.denNgayQd).format('YYYY-MM-DD') + " 23:59:59" : null,
        loaiVthh: this.loaiVthh,
        soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
        soQdPdKqlcnt: this.searchFilter.soQdPdKqlcnt,
        namKhoach: this.searchFilter.namKhoach,
        trichYeu: this.searchFilter.trichYeu,
        soQd: this.searchFilter.soQd,
        lastest: 1,
        paggingReq: {
          limit: this.pageSize,
          page: this.page - 1,
        },
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null
      };
    }
    let res = await this.thongTinDauThauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (data && data.content && data.content.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable)
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  searchDanhSachDauThau(body, trangThai) {
    body.trangThai = trangThai
    return this.danhSachDauThauService.search(body);
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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(data, roles?: any) {
    // VẬt tư
    // if (this.loaiVthh.startsWith('02')) {
    //   this.selectedId = data.hhQdKhlcntHdr.id;
    // } else {
    //   this.selectedId = data.id;
    // }
    if (roles == 'NHDTQG_PTDT_TCKHLCNT_LT_TTDT_XEM' || roles == 'NHDTQG_PTDT_TCKHLCNT_VT_TTDT_XEM') {
      this.isView = true;
    } else {
      this.isView = false
    }
    this.selectedId = data.id;
    if (this.loaiVthh.startsWith('02')) {
      this.isDetailVt = true;
    } else {
      this.isDetail = true;
    }
  }

  async showList() {
    this.isDetail = false;
    this.isDetailVt = false;
    await this.search()
  }

  clearFilter() {
    this.searchFilter.namKhoach = null;
    this.searchFilter.soQd = null;
    this.searchFilter.ngayQd = null;
    this.searchFilter.maDvi = null;
    this.searchFilter.trichYeu = null;
    this.searchFilter.loaiVthh = null;
    this.searchFilter.soQdPdKhlcnt = null;
    this.searchFilter.soQdPdKqlcnt = null;
    this.tuNgayQd = null;
    this.denNgayQd = null;
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
            "id": item.id,
            "maDvi": ""
          }
          this.tongHopDeXuatKHLCNTService.delete(body).then(async () => {
            await this.search();
            this.spinner.hide();
          });
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  convertDay(day: string) {
    if (day && day.length > 0) {
      return dayjs(day).format('DD/MM/YYYY');
    }
    return '';
  }

  statusGoiThau(status: string) {
    return convertTrangThaiGt(status);
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {};
        if (this.loaiVthh.startsWith('02')) {
          body = {
            tuNgayQd: this.tuNgayQd != null ? dayjs(this.tuNgayQd).format('YYYY-MM-DD') + " 00:00:00" : null,
            denNgayQd: this.denNgayQd != null ? dayjs(this.denNgayQd).format('YYYY-MM-DD') + " 23:59:59" : null,
            loaiVthh: this.loaiVthh,
            namKhoach: this.searchFilter.namKhoach,
            soQd: this.searchFilter.soQd,
            soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
            soQdPdKqlcnt: this.searchFilter.soQdPdKqlcnt,
            trangThai: this.STATUS.BAN_HANH,
            lastest: 0,
            paggingReq: {
              limit: this.pageSize,
              page: this.page - 1,
            },
            maDvi: this.userService.isTongCuc() ? '' : this.userInfo.MA_DVI
          };
        } else {
          body = {
            tuNgayQd: this.tuNgayQd != null ? dayjs(this.tuNgayQd).format('YYYY-MM-DD') + " 00:00:00" : null,
            denNgayQd: this.denNgayQd != null ? dayjs(this.denNgayQd).format('YYYY-MM-DD') + " 23:59:59" : null,
            loaiVthh: this.loaiVthh,
            soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
            soQdPdKqlcnt: this.searchFilter.soQdPdKqlcnt,
            namKhoach: this.searchFilter.namKhoach,
            trichYeu: this.searchFilter.trichYeu,
            soQd: this.searchFilter.soQd,
            lastest: 1,
            paggingReq: {
              limit: this.pageSize,
              page: this.page - 1,
            },
            maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null
          };
        }
        this.thongTinDauThauService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-cac-goi-thau.xlsx'),
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


  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai !== STATUS.TRUNG_THAU) {
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


  clearFilterTable() {
    this.filterTable = {
      namKhoach: '',
      trangThai: '',
      tenGthau: '',
      tenDvi: '',
      soQdPdKhlcnt: '',
      ngayQd: '',
      trichYeu: '',
      tenVthh: '',
      tenCloaiVthh: '',
      thanhGiaGoiThau: '',
      tenTrangThai: '',
      tgianThien: ''
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (['ngayKy', 'ngayGiaoNhan', 'ngayHieuLuc', 'ngayHetHieuLuc', 'ngayDeXuat', 'ngayTongHop', 'ngayTao', 'ngayQd', 'tgianNhang'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else if (!this.loaiVthh.startsWith('02') && ['soQd', 'soQdPdKqLcnt', 'tenPthucLcnt', 'soQdPdKqLcnt', 'tenLoaiVthh', 'tenCloaiVthh', 'ngayKyQdPduyetKqlcntHdr', 'tgianNhangDxuatKhLcntHdr'].includes(key)) {
            if (item['hhQdKhlcntHdr'] != null) {

              if (item['hhQdKhlcntHdr'][key] && item['hhQdKhlcntHdr'][key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                temp.push(item)
              }
            }

            if (item['hhQdPduyetKqlcntHdr'] != null) {

              if (key != 'soQd' && key != 'ngayKyQdPduyetKqlcntHdr' && item['hhQdPduyetKqlcntHdr'][key] && item['hhQdPduyetKqlcntHdr'][key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                temp.push(item)
              }
              if (key != 'soQd' && key != 'ngayKyQdPduyetKqlcntHdr' && key == 'soQdPdKqLcnt' && item['hhQdPduyetKqlcntHdr'].soQd && item['hhQdPduyetKqlcntHdr'].soQd.toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                temp.push(item)
              }
              if (key != 'soQd' && key == 'ngayKyQdPduyetKqlcntHdr' && item['hhQdPduyetKqlcntHdr'].ngayKy && dayjs(item['hhQdPduyetKqlcntHdr'].ngayKy).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
                temp.push(item)
              }
            } else {
              if (key == 'ngayKyQdPduyetKqlcntHdr' && item['ngayPduyet'] && dayjs(item['ngayPduyet']).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
                temp.push(item)
              }
            }

            if (item['dxuatKhLcntHdr'] != null) {
              if (key == 'tgianNhangDxuatKhLcntHdr' && item['dxuatKhLcntHdr']['tgianNhang'] && dayjs(item['dxuatKhLcntHdr']['tgianNhang']).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
                temp.push(item)
              }
            }
          } else {
            if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item)
            }
            if (!this.loaiVthh.startsWith('02') && key == 'soTrHdr' && item['soTrHdr'] && item['soTrHdr'].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item)
            } else if (!this.loaiVthh.startsWith('02') && key == 'soTrHdr' && item['soDxuat'] && item['soDxuat'].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item)
            }
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  openDxKhlcntModal(id?: number, soDx?: string) {
    if (id) {
      this.idDx = id;
    } else {
      this.soDx = soDx;
    }
    this.openDxKhlcnt = true;
  }

  closeDxKhlcntModal() {
    this.idDx = null;
    this.soDx = null;
    this.openDxKhlcnt = false;
  }

  openQdKqKhlcntModal(id?: number) {
    this.idQdKq = id;
    this.openQdKqKhlcnt = true;
  }

  closeQdKqKhlcntModal() {
    this.idQdKq = null;
    this.openQdKqKhlcnt = false;
  }

  openQdPdKqKhlcntModal(id?: number, soQd?: string) {
    if (soQd) {
      this.soQdPdKq = soQd
    } else {
      this.idQdPdKq = id;
    }
    this.openQdPdKqKhlcnt = true;
  }

  closeQdPdKqKhlcntModal() {
    this.idQdPdKq = null;
    this.soQdPdKq = null;
    this.openQdPdKqKhlcnt = false;
  }
}
