import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai, convertTrangThaiGt, convertVthhToId } from 'src/app/shared/commonFunction';
import { saveAs } from 'file-saver';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { STATUS } from 'src/app/constants/status';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';

@Component({
  selector: 'app-quyetdinh-ketqua-lcnt',
  templateUrl: './quyetdinh-ketqua-lcnt.component.html',
  styleUrls: ['./quyetdinh-ketqua-lcnt.component.scss']
})
export class QuyetdinhKetquaLcntComponent implements OnInit {

  @Input() loaiVthh: string

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private modal: NzModalService,
    public userService: UserService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,
    private danhMucService: DanhMucService
  ) {

  }
  listNam: any[] = [];
  yearNow: number = 0;
  isView: boolean = false;

  searchFilter = {
    soQdPdKhlcnt: '',
    soQdPdKqlcnt: '',
    soQdinh: '',
    namKhoach: '',
    ngayTongHop: '',
    cloaiVthh: '',
    tenCloaiVthh: '',
    loaiVthh: '',
    tenVthh: '',
    trichYeu: '',
    soGoiThau: ''
  };

  filterTable: any = {
    namKhoach: '',
    soQd: '',
    ngayTao: '',
    trichYeu: '',
    soQdPdKhlcnt: '',
    idQdPdKhlcnt: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    soGthau: '',
    soGthauTrung: '',
    tgianNhang: '',
    trangThai: '',
  };

  dataTableAll: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  allChecked = false;
  indeterminate = false;
  getCount = new EventEmitter<any>();
  listVthh: any[] = [];
  lastBreadcrumb: string;
  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  idQdKq: number = 0;
  openQdKqKhlcnt = false;
  tuNgayQd: Date | null = null;
  denNgayQd: Date | null = null;
  dsLoaiVthh: any[] = [];

  STATUS = STATUS

  listTrangThai: any[] = [
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
  ];
  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      };
      await this.loadDsVthh();
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getListVthh() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          element.count = 0;
          this.listVthh.push(element);
        });
      }
    }
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  async search() {
    let body = {
      tuNgayKy: this.tuNgayQd != null ? dayjs(this.tuNgayQd).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayKy: this.denNgayQd != null ? dayjs(this.denNgayQd).format('YYYY-MM-DD') + " 23:59:59" : null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
      soQd: this.searchFilter.soQdPdKqlcnt,
      loaiVthh: this.searchFilter.loaiVthh ? this.searchFilter.loaiVthh : this.loaiVthh,
      cloaiVthh: this.searchFilter.cloaiVthh,
      namKhoach: this.searchFilter.namKhoach,
      trichYeu: this.searchFilter.trichYeu,
      maDvi: this.userService.isTongCuc() ? '' : this.userInfo.MA_DVI
    };
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      console.log(this.dataTable)
      this.totalRecord = data.totalElements;
      // if (this.dataTable && this.dataTable.length > 0) {
      //   this.dataTable.forEach((item) => {
      //     item.statusConvert = this.convertTrangThai(item.trangThai);
      //     item.statusGT = this.statusGoiThau(item.statusGthau);
      //   });
      // }
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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


  redirectToChiTiet(id: number, roles: any) {
    if (roles != "NHDTQG_PTDT_TCKHLCNT_LT_QDKQLCNT_XEM") {
      this.isViewDetail = false;
    } else {
      this.isViewDetail = true;
    }
    this.selectedId = id;
    this.isDetail = true;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  clearFilter() {
    this.searchFilter.namKhoach = null;
    this.searchFilter.trichYeu = null;
    this.searchFilter.loaiVthh = null;
    this.searchFilter.cloaiVthh = null;
    this.searchFilter.tenVthh = null;
    this.searchFilter.tenCloaiVthh = null;
    this.searchFilter.ngayTongHop = null;
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
          this.quyetDinhPheDuyetKetQuaLCNTService.delete(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
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

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  statusGoiThau(status: string) {
    return convertTrangThaiGt(status);
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiVthh = res.data;
      this.dsLoaiVthh = res.data?.filter((x) => x.ma.length == 4 && x.loaiHang == "VT");
    }
  }
  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayKy: this.tuNgayQd != null ? dayjs(this.tuNgayQd).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayKy: this.denNgayQd != null ? dayjs(this.denNgayQd).format('YYYY-MM-DD') + " 23:59:59" : null,
          soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
          soQdinh: this.searchFilter.soQdinh,
          cloaiVthh: this.searchFilter.cloaiVthh,
          loaiVthh: this.loaiVthh,
          namKhoach: this.searchFilter.namKhoach

        };
        this.quyetDinhPheDuyetKetQuaLCNTService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-phe-duyet-ket-qua-lcnt.xlsx'),
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

  xoa() {
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
            let res = await this.quyetDinhPheDuyetKetQuaLCNTService.deleteMuti({ ids: dataDelete });
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
      if (this.page === 1) {
        await this.search();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (['ngayKy', 'ngayGiaoNhan', 'ngayHieuLuc', 'ngayHetHieuLuc', 'ngayDeXuat', 'ngayTongHop', 'ngayTao', 'ngayQd', 'tgianNhang', 'tgianThien'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else if (['tenLoaiVthh', 'tenCloaiVthh'].includes(key)) {
            if (item['qdKhlcntDtl'].hhQdKhlcntHdr.tenLoaiVthh && item['qdKhlcntDtl'].hhQdKhlcntHdr.tenLoaiVthh.toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item)
            }
            if (item['qdKhlcntDtl'].hhQdKhlcntHdr.tenCloaiVthh && item['qdKhlcntDtl'].hhQdKhlcntHdr.tenCloaiVthh.toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item)
            }
          } else {
            if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
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

  clearFilterTable() {
    this.filterTable = {
      soQd: '',
      ngayTongHop: '',
      trichYeu: '',
      tenGthau: '',
      statusGT: '',
      tenNhaThau: '',
      lyDoHuy: '',
      donGiaTrcVat: '',
      tenHdong: '',
      tgianThienHd: '',
      statusConvert: '',
    }
  }

  selectHangHoa() {
    let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.searchFilter.cloaiVthh = data.ma,
          this.searchFilter.tenCloaiVthh = data.ten,
          this.searchFilter.loaiVthh = data.parent.ma,
          this.searchFilter.tenVthh = data.parent.ten
      }
    });
  }


  openQdKqKhlcntModal(id?: number) {
    this.idQdKq = id;
    this.openQdKqKhlcnt = true;
  }

  closeQdKqKhlcntModal() {
    this.idQdKq = null;
    this.openQdKqKhlcnt = false;
  }

}
