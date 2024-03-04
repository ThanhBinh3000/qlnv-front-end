import { cloneDeep } from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { QuyetDinhPheDuyetKetQuaLCNTService } from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service";
import { STATUS } from "../../../../../constants/status";
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from "../../../../../components/base2/base2.component";

@Component({
  selector: 'app-danh-sach-hop-dong',
  templateUrl: './danh-sach-hop-dong.component.html',
  styleUrls: ['./danh-sach-hop-dong.component.scss'],
})

export class DanhSachHopDongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  ngayKy: string;
  soHd: string;
  userInfo: UserLogin;
  tenHd: string;
  nhaCungCap: string;
  nam: number;

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
  idGoiThau: number = 0;
  openQdPdKhlcnt = false;
  qdPdKhlcntId: number = 0;
  openQdPdKqlcnt = false;
  qdPdKqlcntId: number = 0;
  tuNgayKy: Date | null = null;
  denNgayKy: Date | null = null;

  STATUS = STATUS;
  filterTable: any = {
    namKhoach: '',
    tenHd: '',
    ngayKy: '',
    loaiVthh: '',
    chungLoaiVthh: '',
    chuDauTu: '',
    nhaCungCap: '',
    gtriHdSauVat: '',
  };

  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' }
  ];

  constructor(
    spinner: NgxSpinnerService,
    notification: NzNotificationService,
    modal: NzModalService,
    private httpClient: HttpClient,
    private storageService: StorageService,
    public userService: UserService,
    private donViService: DonviService,
    private thongTinHopDong: ThongTinHopDongService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinHopDong);
  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      this.userInfo = this.userService.getUserLogin();
      console.log(this.loaiVthh);
      await this.loadDonVi();
      await this.search();
      await this.checkPriceAdjust('xuất hàng');
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
    this.spinner.show();
    let body = {
      tuNgayKy: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayKy: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      soHd: this.soHd,
      tenHd: this.tenHd,
      namKhoach: this.nam,
      maDvi: this.userService.isTongCuc() ? null : this.userInfo.MA_DVI,
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh
    };
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if(item.hhQdKhlcntHdr) {
            let sum = 0;
            item.hhQdKhlcntHdr.children.forEach(i => {
              sum += i.donGiaNhaThau * i.soLuong;
            })
            item.hhQdKhlcntHdr.thanhTien = sum;
          }
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      await this.spinner.hide();
    } else {
      await this.spinner.hide();
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  xoaItem(item: any) {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
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
        let res = await this.thongTinHopDong.delete(body);
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
    this.nam = null;
    this.ngayKy = null;
    this.soHd = null;
    this.tuNgayKy = null;
    this.denNgayKy = null;
    this.tenHd = null;
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
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.selectedId = data.id;
    this.isDetail = true;
    this.isAddNew = false;
    this.isQuanLy = true;
    this.isView = isView;
    this.idGoiThau = data.idGoiThau;
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
          tuNgayKy: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayKy: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null,
          paggingReq: {
            limit: this.pageSize,
            page: this.page - 1,
          },
          soHd: this.soHd,
          tenHd: this.tenHd,
          namKhoach: this.nam,
          maDvi: this.userService.isTongCuc() ? null : this.userInfo.MA_DVI,
          trangThai: STATUS.BAN_HANH,
          loaiVthh: this.loaiVthh
        };
        this.quyetDinhPheDuyetKetQuaLCNTService
          .exportHd(body)
          .subscribe((blob) => saveAs(blob, 'quan_ly_ky_hop_dong_mua_hang_dtqg.xlsx'));
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
            let res = await this.thongTinHopDong.deleteMuti({ ids: dataDelete });
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
    if (value != null && value != "") {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (["tenLoaiVthh"].includes(key)) {
            if (item["hhQdKhlcntHdr"].tenLoaiVthh && item["hhQdKhlcntHdr"].tenLoaiVthh.toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item);
            }
          } else if (["tgianNhang"].includes(key)) {
            if (item["qdKhlcntDtl"].dxuatKhLcntHdr.tgianNhang && dayjs(item["qdKhlcntDtl"].dxuatKhLcntHdr.tgianNhang).format("DD/MM/YYYY").indexOf(value.toString()) != -1) {
              temp.push(item);
            }
          } else if (["tgianThien"].includes(key)) {
            if (item["hhQdKhlcntHdr"].tgianThien && item["hhQdKhlcntHdr"].tgianThien.toString().indexOf(value.toString()) != -1) {
              temp.push(item);
            }
          } else if (["soGthauTrung"].includes(key)) {
            if (item["qdKhlcntDtl"].soGthauTrung && item["qdKhlcntDtl"].soGthauTrung.toString().indexOf(value.toString()) != -1) {
              temp.push(item);
            }
          } else if (["tenCloaiVthh"].includes(key)) {
            if (item["qdKhlcntDtl"].hhQdKhlcntHdr.tenCloaiVthh && item["qdKhlcntDtl"].hhQdKhlcntHdr.tenCloaiVthh.toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item);
            }
          } else if (["slHdDaKy"].includes(key)) {
            if (item["listHopDong"] && item["listHopDong"].length.toString().indexOf(value.toString()) != -1) {
              temp.push(item);
            }
          } else if (["tongMucDt"].includes(key)) {
            if (this.loaiVthh.startsWith("02")) {
              if ((item["hhQdKhlcntHdr"].thanhTien).toString().indexOf(value.toString()) != -1) {
                temp.push(item);
              }
            } else {
              if (item["qdKhlcntDtl"].donGiaVat && item["qdKhlcntDtl"].soLuong && (item["qdKhlcntDtl"].donGiaVat * item["qdKhlcntDtl"].soLuong * 1000).toString().indexOf(value.toString()) != -1) {
                temp.push(item);
              }
            }
          } else if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1 || item[key] == value) {
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
      soHd: '',
      tenHd: '',
      ngayKy: '',
      loaiVthh: '',
      chungLoaiVthh: '',
      chuDauTu: '',
      nhaCungCap: '',
      gtriHdSauVat: '',
    };
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  openQdPdKhlcntModal(id: number) {
    this.qdPdKhlcntId = id;
    this.openQdPdKhlcnt = true;
  }
  closeQdPdKhlcntModal() {
    this.qdPdKhlcntId = null;
    this.openQdPdKhlcnt = false;
  }

  openQdPdKqlcntModal(id: number) {
    this.qdPdKqlcntId = id;
    this.openQdPdKqlcnt = true;
  }
  closeQdPdKqlcntModal() {
    this.qdPdKqlcntId = null;
    this.openQdPdKqlcnt = false;
  }

  disabledTuNgayKy = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKy) {
      return false;
    }
    return startValue.getTime() > this.denNgayKy.getTime();
  };

  disabledDenNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKy) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKy.getTime();
  };
}
