import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { ThongBaoDauGiaKhongThanhCongService } from 'src/app/services/thongBaoDauGiaKhongThanhCong.service';
@Component({
  selector: 'app-thong-bao-dau-gia-khong-thanh',
  templateUrl: './thong-bao-dau-gia-khong-thanh.component.html',
  styleUrls: ['./thong-bao-dau-gia-khong-thanh.component.scss'],
})
export class ThongBaoDauGiaKhongThanhComponent implements OnInit {
  @Input() typeVthh: string;
  qdTCDT: string = MESSAGE.QD_TCDT;

  searchFilter = {
    soQuyetDinhNhap: '',
    soBienBan: '',
    ngayBienBan: '',
    namKh: '',
    trichYeu: '',
  };

  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  listNam: any[] = [];
  yearNow: number = 0;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    maThongBao: '',
    ngayToChuc: '',
    trichYeu: '',
    soQdPdKhBdg: '',
    maThongBaoBdg: '',
    hinhThucDauGia: '',
    phuongThucDauGia: '',
    tenVatTuCha: '',
    nam: '',
    soQdPdKqBdg: '',
    tenTrangThai: '',
  };

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private thongBaoDauGiaKhongThanhCongService: ThongBaoDauGiaKhongThanhCongService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (!this.typeVthh || this.typeVthh == '') {
        this.isTatCa = true;
      }
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
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

  async search() {
    let body = {
      maDvis: this.userInfo.MA_DVI,
      maVatTuCha: this.typeVthh,
      maThongBaoBdg: null,
      ngayToChucBdgTu:
        this.searchFilter.ngayBienBan &&
          this.searchFilter.ngayBienBan.length > 1
          ? dayjs(this.searchFilter.ngayBienBan[1]).format('YYYY-MM-DD')
          : null,
      ngayToChucBdgDen:
        this.searchFilter.ngayBienBan &&
          this.searchFilter.ngayBienBan.length > 0
          ? dayjs(this.searchFilter.ngayBienBan[0]).format('YYYY-MM-DD')
          : null,
      orderBy: null,
      orderDirection: null,
      paggingReq: {
        limit: this.pageSize,
        orderBy: null,
        orderType: null,
        page: this.page - 1,
      },
      soBienBan: this.searchFilter.soBienBan,
      soQd: this.searchFilter.soQuyetDinhNhap,
      str: null,
      trangThai: null,
      nam: this.searchFilter.namKh,
      trichYeu: this.searchFilter.trichYeu
    };
    let res = await this.thongBaoDauGiaKhongThanhCongService.timKiem(body);
    console.log(res.data.content)
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
      soQuyetDinhNhap: '',
      soBienBan: '',
      ngayBienBan: '',
      namKh: '',
      trichYeu: '',
    };
    this.search();
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
          this.thongBaoDauGiaKhongThanhCongService
            .deleteData(item.id)
            .then((res) => {
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
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
          maDonVi: this.userInfo.MA_DVI,
          maHangHoa: this.typeVthh,
          maNganKho: null,
          ngayKiemTraDenNgay:
            this.searchFilter.ngayBienBan &&
              this.searchFilter.ngayBienBan.length > 1
              ? dayjs(this.searchFilter.ngayBienBan[1]).format('YYYY-MM-DD')
              : null,
          ngayKiemTraTuNgay:
            this.searchFilter.ngayBienBan &&
              this.searchFilter.ngayBienBan.length > 0
              ? dayjs(this.searchFilter.ngayBienBan[0]).format('YYYY-MM-DD')
              : null,
          ngayLapPhieu: null,
          orderBy: null,
          orderDirection: null,
          paggingReq: null,
          soBienBan: this.searchFilter.soBienBan,
          soQd: this.searchFilter.soQuyetDinhNhap,
          str: null,
          tenNguoiGiao: null,
          trangThai: null,
        };
        this.thongBaoDauGiaKhongThanhCongService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-phieu-kiem-tra-chat-luong-hang.xlsx'),
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
            let res =
              await this.thongBaoDauGiaKhongThanhCongService.deleteMultiple({
                ids: dataDelete,
              });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
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
    } else {
      this.notification.error(
        MESSAGE.ERROR,
        'Không có dữ liệu phù hợp để xóa.',
      );
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (
            item[key].toString().toLowerCase().indexOf(value.toLowerCase()) !=
            -1
          ) {
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
      maThongBao: '',
      ngayToChuc: '',
      trichYeu: '',
      soQdPdKhBdg: '',
      maThongBaoBdg: '',
      hinhThucDauGia: '',
      phuongThucDauGia: '',
      tenVatTuCha: '',
      nam: '',
      soQdPdKqBdg: '',
      tenTrangThai: '',
    };
  }

  print() { }
}
