import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai, convertVthhToId } from 'src/app/shared/commonFunction';
import dayjs from 'dayjs';
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { STATUS } from 'src/app/constants/status';
import { UserLogin } from 'src/app/models/userlogin';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";

@Component({
  selector: 'app-danh-sach-giao-nhap-hang',
  templateUrl: './danh-sach-giao-nhap-hang.component.html',
  styleUrls: ['./danh-sach-giao-nhap-hang.component.scss']
})

export class DanhSachGiaoNhapHangComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  listVthh: any[] = [];

  userInfo: UserLogin;


  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];
  startValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];

  soQD: string = null;
  canCu: string = null;
  loaiQd: string = null;
  soHd: string = null;
  selectedCanCu: any = null;

  searchFilter = {
    soQd: '',
    ngayQuyetDinh: null,
    namNhap: null,
    trichYeu: '',
    loaiVthh: null,
    cloaiVthh: ''
  };

  listNam: any[] = [];
  ngayQuyetDinhDefault: any[] = [];
  maVthh: string;
  routerVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;

  filterTable: any = {
    soQd: '',
    soBban: '',
    ngayLayMau: '',
    soHd: '',
    tenKho: '',
    tenLo: '',
    tenNgan: '',
  };

  listTrangThai: any[] = [
    { ma: STATUS.BAN_HANH, giaTri: 'Ban Hành' },
    { ma: STATUS.DU_THAO, giaTri: 'Dự Thảo' },
    { ma: STATUS.TU_CHOI_TP, giaTri: 'Từ chối TP' }
  ];
  openHd = false;
  idHd: any;
  dataTableAll: any[] = [];
  allChecked = false;
  indeterminate = false;
  isViewDetail: boolean;
  STATUS = STATUS;
  dsCloaiVthh: any[] = [];
  dsLoaiVthh: any[] = [];
  tuNgayQuyetDinh: Date | null = null;
  denNgayQuyetDinh: Date | null = null;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayQuyetDinh) {
      return false;
    }
    return startValue.getTime() > this.denNgayQuyetDinh.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.denNgayQuyetDinh) {
      return false;
    }
    return endValue.getTime() <= this.denNgayQuyetDinh.getTime();
  };
  constructor(
    private router: Router,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    public userService: UserService,
    private danhMucService: DanhMucService,
    private userSerVice: UserService,
    httpClient: HttpClient,
    spinner: NgxSpinnerService,
    storageService: StorageService,
    notification: NzNotificationService,
    modal: NzModalService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNhapHangService);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') + i,
          text: dayjs().get('year') + i,
        });
      }
      await this.loadDsCloaiVthh(this.loaiVthh);
      await this.search();
      await this.checkPriceAdjust('xuất hàng');
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsCloaiVthh(ma: string) {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ "str": ma });
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        if(this.loaiVthh.startsWith('02')) {
          this.dsLoaiVthh = res.data;
        } else {
          this.dsCloaiVthh = res.data;
        }
      }
    }
  }

  onChangeLoaiVthh(event){
    this.searchFilter.cloaiVthh = ''
    this.dsCloaiVthh = cloneDeep(this.dsLoaiVthh).find(x => x.ma == event).children
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  redirectToThongTin(id: number, isView?: boolean) {
    if (id == 0 && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  clearFilter() {
    this.searchFilter = {
      soQd: '',
      ngayQuyetDinh: null,
      namNhap: null,
      trichYeu: '',
      cloaiVthh: '',
      loaiVthh: ''
    }
    this.tuNgayQuyetDinh = null;
    this.denNgayQuyetDinh = null
    this.search();
  }

  async search() {
    this.spinner.show();
    let body = {
      "tuNgayQd": this.tuNgayQuyetDinh != null ? dayjs(this.tuNgayQuyetDinh).format('YYYY-MM-DD') + " 00:00:00" : null,
      "denNgayQd": this.denNgayQuyetDinh != null ? dayjs(this.denNgayQuyetDinh).format('YYYY-MM-DD') + " 23:59:59" : null,
      "loaiVthh": this.searchFilter.loaiVthh? this.searchFilter.loaiVthh : this.loaiVthh,
      "cloaiVthh": this.searchFilter.cloaiVthh,
      "namNhap": this.searchFilter.namNhap ? this.searchFilter.namNhap : null,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      "soQd": this.searchFilter.soQd ? this.searchFilter.soQd.trim() : null,
      "trichYeu": this.searchFilter.trichYeu ? this.searchFilter.trichYeu : null,
      "maDvi": this.userService.isCuc() ? this.userInfo.MA_DVI : null
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
          if (this.userSerVice.isChiCuc() && this.userService.isAccessPermisson('NHDTQG_PTDT_QDGNVNH_PHANBO')){
            let chiCuc = item.dtlList.find(x => x.maDvi == this.userInfo.MA_DVI);
            item.hoanThanhCapNhat = chiCuc.trangThai != this.STATUS.HOAN_THANH_CAP_NHAT;
          }
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
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
          this.quyetDinhGiaoNhapHangService.delete({ id: item.id }).then((res) => {
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

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "tuNgayQd": this.tuNgayQuyetDinh != null ? dayjs(this.tuNgayQuyetDinh).format('YYYY-MM-DD') + " 00:00:00" : null,
          "denNgayQd": this.denNgayQuyetDinh != null ? dayjs(this.denNgayQuyetDinh).format('YYYY-MM-DD') + " 23:59:59" : null,
          "loaiVthh": this.loaiVthh,
          "cloaiVthh": this.searchFilter.cloaiVthh,
          "namNhap": this.searchFilter.namNhap ? this.searchFilter.namNhap : null,
          "soQd": this.searchFilter.soQd ? this.searchFilter.soQd.trim() : null,
          "trichYeu": this.searchFilter.trichYeu ? this.searchFilter.trichYeu : null,
          "maDvi": this.userService.isCuc() ? this.userInfo.MA_DVI : null
        }
        this.quyetDinhGiaoNhapHangService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-quyet-dinh-giao-nhiem-vu-nhap-hang.xlsx'),
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

  duyet(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_BAN_HANH,
          };
          let res = await this.quyetDinhGiaoNhapHangService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.search();
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

  chiTietQuyetDinh(isView: boolean, id: number) {

  }
  filterInTable(key: string, value: string) {
    if (value != null && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (['ngayQdinh', 'tgianNkho'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1 || item[key] == value) {
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
  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  clearFilterTable() {
    this.filterTable = {
      soQd: '',
      soBban: '',
      ngayLayMau: '',
      soHd: '',
      tenKho: '',
      tenLo: '',
      tenNgan: '',
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
            let res = await this.quyetDinhGiaoNhapHangService.deleteMuti({ idList: dataDelete });
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

  openHdModal(id: number) {
    this.idHd = id;
    this.openHd = true;
  }

  closeHdModal() {
    this.idHd = null;
    this.openHd = false;
  }

}
