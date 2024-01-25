import { QuyetDinhGiaoNvNhapHangService } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai, convertVthhToId } from 'src/app/shared/commonFunction';
import dayjs from 'dayjs';
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-quyetdinh-nhiemvu-nhaphang',
  templateUrl: './quyetdinh-nhiemvu-nhaphang.component.html',
  styleUrls: ['./quyetdinh-nhiemvu-nhaphang.component.scss']
})
export class QuyetdinhNhiemvuNhaphangComponent implements OnInit {
  @Input()
  typeVthh: string;
  @Input()
  listVthh: any[] = [];

  yearNow: number = 0;
  listCloaiVthh: any[] = [];
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];
  startValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  openHd = false;
  idHd: any;
  openQdKh = false;
  idQdKh: any;
  tuNgayQd: Date | null = null;
  denNgayQd: Date | null = null;
  soQD: string = null;
  canCu: string = null;
  loaiQd: string = null;
  soHd: string = null;
  selectedCanCu: any = null;

  searchFilter = {
    soQd: '',
    ngayQd: null,
    namNhap: '',
    trichYeu: '',
    loaiVthh: '',
    cloaiVthh: ''
  };

  listNam: any[] = [];
  ngayQd: any[] = [];
  maVthh: string;
  routerVthh: string;
  loaiVthh: string = '';
  isDetail: boolean = false;
  selectedId: number = 0;

  filterTable: any = {
    soQd: '',
    ngayQd: '',
    tenHdong: '',
    soQdPduyet: '',
    namNhap: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    trichYeu: '',
    tenTrangThai: ''
  };

  dataTableAll: any[] = [];
  allChecked = false;
  indeterminate = false;
  isViewDetail: boolean;
  STATUS = STATUS;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService
  ) {
  }

  async ngOnInit() {
    this.spinner.show();

    try {
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }

      this.searchFilter.loaiVthh = this.typeVthh;
      this.getCloaiVthh();
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getCloaiVthh() {
    let body = {
      "str": this.typeVthh
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCloaiVthh = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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
      ngayQd: null,
      namNhap: null,
      trichYeu: '',
      loaiVthh: '',
      cloaiVthh: ''
    }
    this.tuNgayQd = null
    this.denNgayQd = null
    this.search();
  }

  async search() {
    this.spinner.show();
    let body = {
      "namNhap": this.searchFilter.namNhap ? this.searchFilter.namNhap : null,
      "soQd": this.searchFilter.soQd ? this.searchFilter.soQd.trim() : null,
      "loaiVthh": this.typeVthh,
      "cloaiVthh": this.searchFilter.cloaiVthh ? this.searchFilter.cloaiVthh : null,
      "ngayQdTu": this.tuNgayQd != null ? dayjs(this.tuNgayQd).format('YYYY-MM-DD') + " 00:00:00" : null,
      "ngayQdDen": this.denNgayQd != null ? dayjs(this.denNgayQd).format('YYYY-MM-DD') + " 23:59:59" : null,

      "trichYeu": this.searchFilter.trichYeu ? this.searchFilter.trichYeu : null,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
    }
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      console.log(this.dataTable, "datatable")
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
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

  filterInTable(key: string, value: string | Date) {
    if (value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }
    console.log(key, value);

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
          this.quyetDinhGiaoNvNhapHangService.delete({ id: item.id }).then((res) => {
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
          "namNhap": this.searchFilter.namNhap ? this.searchFilter.namNhap : null,
          "soQd": this.searchFilter.soQd ? this.searchFilter.soQd.trim() : null,
          "loaiVthh": this.typeVthh,
          "cloaiVthh": this.searchFilter.cloaiVthh ? this.searchFilter.cloaiVthh : null,
          "tuNgayQd": this.searchFilter.ngayQd
            ? dayjs(this.searchFilter.ngayQd[0]).format('YYYY-MM-DD')
            : null,
          "denNgayQd": this.searchFilter.ngayQd
            ? dayjs(this.searchFilter.ngayQd[1]).format('YYYY-MM-DD')
            : null,
          "trichYeu": this.searchFilter.trichYeu ? this.searchFilter.trichYeu : null,
        }
        this.quyetDinhGiaoNvNhapHangService
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

  chiTietQuyetDinh(isView: boolean, id: number) {

  }

  clearFilterTable() {
    this.filterTable = {
      soQd: '',
      ngayQd: '',
      tenHdong: '',
      soQdPduyet: '',
      namNhap: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      trichYeu: '',
      tenTrangThai: ''
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
            let res = await this.quyetDinhGiaoNvNhapHangService.deleteMuti({ idList: dataDelete });
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

  openHdModal(id: number, idQdKh: number) {
    this.idHd = id;
    this.idQdKh = idQdKh;
    this.openHd = true;
  }

  closeHdModal() {
    this.idHd = null;
    this.openHd = false;
  }

  openQdKhModal(id: number) {
    this.idQdKh = id;
    this.openQdKh = true;
  }

  closeQdKhModal() {
    this.idQdKh = null;
    this.openQdKh = false;
  }

}
