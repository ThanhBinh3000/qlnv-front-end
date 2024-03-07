import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemTraChatLuongHang.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../constants/status";
import {
  QuyetDinhGiaoNhapHangService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service";
import { QuanLyNghiemThuKeLotService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";

@Component({
  selector: 'quan-ly-phieu-kiem-tra-chat-luong-hang',
  templateUrl: './quan-ly-phieu-kiem-tra-chat-luong-hang.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-tra-chat-luong-hang.component.scss'],
})
export class QuanLyPhieuKiemTraChatLuongHangComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  qdTCDT: string = MESSAGE.QD_TCDT;
  listNam: any[] = [];
  yearNow = dayjs().get('year');

  searchFilter = {
    soPhieu: '',
    ngayTongHop: '',
    kqDanhGia: '',
    soQuyetDinh: '',
    namKhoach: '',
    soBb: ''
  };

  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  idQdGiaoNvNh: number = 0;
  maNganLoKho: string;
  isTatCa: boolean = false;
  tuNgayGD: Date | null = null;
  denNgayGD: Date | null = null;
  tuNgayKT: Date | null = null;
  denNgayKT: Date | null = null;
  allChecked = false;
  indeterminate = false;
  STATUS = STATUS;

  filterTable: any = {
    soPhieu: '',
    ngayGdinh: '',
    kqDanhGia: '',
    soQuyetDinhNhap: '',
    soBienBan: '',
    tenDiemKho: '',
    tenNganLo: '',
    tenNhaKho: '',
    tenTrangThai: '',
  };
  titleStatus: "";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private quanLyNghiemThuKeLotService: QuanLyNghiemThuKeLotService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyPhieuKiemTraChatLuongHangService);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
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

  async search() {
    await this.spinner.show();
    let body = {
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.BAN_HANH,
      soQd: this.searchFilter.soQuyetDinh,
      namNhap: this.searchFilter.namKhoach,
      kqDanhGia: this.searchFilter.kqDanhGia,
      soBbNtBq: this.searchFilter.soBb,
      tuNgayGD: this.tuNgayGD != null ? dayjs(this.tuNgayGD).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayGD: this.denNgayGD != null ? dayjs(this.denNgayGD).format('YYYY-MM-DD') + " 24:59:59" : null,
    };
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      for (let i = 0; i < this.dataTable.length; i++) {
        if (this.userService.isChiCuc()) {
          this.dataTable[i].detail = this.dataTable[i].dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
        } else {
          let data = [];
          let listBienBanNghiemThuBq = [];
          this.dataTable[i].dtlList.forEach(item => {
            data = [...data, ...item.children];
            listBienBanNghiemThuBq = [...listBienBanNghiemThuBq, ...item.listBienBanNghiemThuBq];
          })
          this.dataTable[i].detail = {
            children: data,
            listBienBanNghiemThuBq: listBienBanNghiemThuBq
          }
        };
        this.expandSet.add(i)
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
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

  clearFilter() {
    this.searchFilter = {
      soPhieu: '',
      ngayTongHop: '',
      kqDanhGia: '',
      soQuyetDinh: '',
      namKhoach: '',
      soBb: ''
    };
    this.tuNgayGD = null;
    this.denNgayGD = null;
    this.search();
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
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
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.quanLyPhieuKiemTraChatLuongHangService.delete({ id: item.id }).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
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

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number, maNganLoKho?: string ) {
    if (id == 0 && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh;
    this.maNganLoKho = maNganLoKho;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          loaiVthh: this.loaiVthh,
          trangThai: STATUS.BAN_HANH,
          soQd: this.searchFilter.soQuyetDinh,
          namNhap: this.searchFilter.namKhoach,
          soBbNtBq: this.searchFilter.soBb,
          tuNgayGD: this.tuNgayGD != null ? dayjs(this.tuNgayGD).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayGD: this.denNgayGD != null ? dayjs(this.denNgayGD).format('YYYY-MM-DD') + " 24:59:59" : null
        };
        this.quanLyNghiemThuKeLotService
          .exportPktCl(body)
          .subscribe((blob) =>
            saveAs(blob, 'Danh_sach_phieu_kiem_tra_chat_luong.xlsx'),
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
            let res = await this.quanLyPhieuKiemTraChatLuongHangService.deleteMultiple({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
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
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
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
    this.filterTable = {
      soPhieu: '',
      ngayGdinh: '',
      kqDanhGia: '',
      soQuyetDinhNhap: '',
      soBienBan: '',
      tenDiemKho: '',
      tenNganLo: '',
      tenNhaKho: '',
      tenTrangThai: '',
    }
  }

  print() {

  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }

  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }

  disabledTuNgayGD = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayGD) {
      return false;
    }
    return startValue.getTime() > this.denNgayGD.getTime();
  };

  disabledDenNgayGD = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayGD) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayGD.getTime();
  };

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_PKTCL_XEM') && data != null) {
      if(this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_PKTCL_THEM') && (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_LDCC)) {
        return false;
      } else if (this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_PKTCL_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC) {
        return false;
      }
      return true;
    }
    return false;
  }
}
