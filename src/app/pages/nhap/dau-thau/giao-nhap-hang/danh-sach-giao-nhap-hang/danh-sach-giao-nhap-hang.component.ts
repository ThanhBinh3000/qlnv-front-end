import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuHopDongComponent } from 'src/app/components/dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import { LOAI_HANG_DTQG, LOAI_QUYET_DINH, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { UserService } from 'src/app/services/user.service';
import { convertTenVthh, convertTrangThai } from 'src/app/shared/commonFunction';
import dayjs from 'dayjs';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-danh-sach-giao-nhap-hang',
  templateUrl: './danh-sach-giao-nhap-hang.component.html',
  styleUrls: ['./danh-sach-giao-nhap-hang.component.scss']
})
export class DanhSachGiaoNhapHangComponent implements OnInit, OnChanges {
  @Input()
  typeVthh: string;
  @Output()
  getCount = new EventEmitter<any>();
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];

  startValue: Date | null = null;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;


  loaiVTHH: string = null;
  soQD: string = null;
  canCu: string = null;
  loaiQd: string = null;
  soHd: string = null;

  selectedCanCu: any = null;
  searchFilter = {
    soQd: '',
    ngayQuyetDinh: null,
    namNhap: null,
    trichYeu: ''
  };
  listNam: any[] = [];
  routerUrl: string;
  yearNow: number;
  ngayQuyetDinhDefault: any[] = [];

  maVthh: string;
  routerVthh: string;
  loaiVthh: string = '';
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
  dataTableAll: any[] = [];
  allChecked = false;
  indeterminate = false;
  isViewDetail: boolean;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
  ) {
  }

  async ngOnInit() {
    console.log(this.typeVthh)
    this.spinner.show();
    try {
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.searchFilter.namNhap = this.yearNow;
      this.ngayQuyetDinhDefault = [];
      this.ngayQuyetDinhDefault.push(dayjs().subtract(30, 'day').toDate());
      this.ngayQuyetDinhDefault.push(dayjs().toDate());
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
    this.getCount.emit();
    await this.search()
  }

  clearFilter() {
    this.searchFilter = {
      soQd: '',
      ngayQuyetDinh: null,
      namNhap: null,
      trichYeu: ''
    }
    this.search();
  }

  async search() {
    this.spinner.show();
    let body = {
      "denNgayQd": this.searchFilter.ngayQuyetDinh
        ? dayjs(this.searchFilter.ngayQuyetDinh[1]).format('YYYY-MM-DD')
        : null,
      "loaiQd": null,
      "maDvi": null,
      "maVthh": null,
      "loaiVthh": this.typeVthh,
      "namNhap": this.searchFilter.namNhap ? this.searchFilter.namNhap : null,
      "ngayQd": null,
      "orderBy": null,
      "orderDirection": null,
      "paggingReq": {
        "limit": this.pageSize,
        "orderBy": null,
        "orderType": null,
        "page": this.page - 1
      },
      "soHd": null,
      "soQd": this.searchFilter.soQd ? this.searchFilter.soQd.trim() : null,
      "str": null,
      "trangThai": null,
      "tuNgayQd": this.searchFilter.ngayQuyetDinh
        ? dayjs(this.searchFilter.ngayQuyetDinh[0]).format('YYYY-MM-DD')
        : null,
      "trichYeu": this.searchFilter.trichYeu ? this.searchFilter.trichYeu : null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
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
          this.quyetDinhGiaoNhapHangService.xoa({ id: item.id }).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
              this.getCount.emit();
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
          "denNgayQd": this.searchFilter.ngayQuyetDinh
            ? dayjs(this.searchFilter.ngayQuyetDinh[1]).format('YYYY-MM-DD')
            : null,
          "loaiQd": null,
          "maDvi": null,
          "maVthh": null,
          "loaiVthh": this.typeVthh ?? null,
          "namNhap": this.searchFilter.namNhap ? this.searchFilter.namNhap : null,
          "ngayQd": null,
          "orderBy": null,
          "orderDirection": null,
          "paggingReq": {
            "limit": this.pageSize,
            "orderBy": null,
            "orderType": null,
            "page": this.page - 1
          },
          "soHd": null,
          "soQd": this.searchFilter.soQd ? this.searchFilter.soQd.trim() : null,
          "str": null,
          "trangThai": null,
          "tuNgayQd": this.searchFilter.ngayQuyetDinh
            ? dayjs(this.searchFilter.ngayQuyetDinh[0]).format('YYYY-MM-DD')
            : null,
          "trichYeu": this.searchFilter.trichYeu ? this.searchFilter.trichYeu : null,
          "veViec": null
        }
        this.quyetDinhGiaoNhapHangService
          .exportList(body)
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
          let res = await this.quyetDinhGiaoNhapHangService.updateStatus(body);
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
            let res = await this.quyetDinhGiaoNhapHangService.deleteMultiple({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.getCount.emit();
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
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.typeVthh);
    this.ngOnInit();
  }
}
