import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { HoSoKyThuatService } from 'src/app/services/hoSoKyThuat.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
@Component({
  selector: 'app-ho-so-ky-thuat',
  templateUrl: './ho-so-ky-thuat.component.html',
  styleUrls: ['./ho-so-ky-thuat.component.scss']
})
export class HoSoKyThuatComponent implements OnInit {
  @Input() typeVthh: string;

  qdTCDT: string = MESSAGE.QD_TCDT;

  searchFilter = {
    soQdNhap: '',
    soBienBan: '',
    tenVatTuCha: '',
    maVatTuCha: '',
    tenVatTu: '',
    maVatTu: '',
    ngayTongHop: '',
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
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    soBienBan: '',
    soQuyetDinhNhap: '',
    ngayKiemTra: '',
    tenVatTuCha: '',
    tenVatTu: '',
    ketLuan: '',
    tenTrangThai: ''
  };

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private hoSoKyThuatService: HoSoKyThuatService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
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
    let body = {
      "capDvis": '3',
      "maDvi": this.userInfo.MA_DVI,
      "maVatTu": this.searchFilter.maVatTu,
      "maVatTuCha": this.searchFilter.maVatTuCha,
      "ngayKiemTraDen": this.searchFilter.ngayTongHop && this.searchFilter.ngayTongHop.length > 1 ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD') : null,
      "ngayKiemTraTu": this.searchFilter.ngayTongHop && this.searchFilter.ngayTongHop.length > 0 ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD') : null,
      "pageSize": this.pageSize,
      "pageNumber": this.page,
      "soBienBan": this.searchFilter.soBienBan,
      "soQdNhap": this.searchFilter.soQdNhap,
    };
    let res = await this.hoSoKyThuatService.timKiem(body);
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

  selectHangHoa() {
    let data = this.typeVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: { data },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      this.searchFilter.maVatTuCha = data.parent.ma;
      this.searchFilter.tenVatTuCha = data.parent.ten;
      this.searchFilter.maVatTu = data.ma;
      this.searchFilter.tenVatTu = data.ten;
    }
    if (data.loaiHang == "VT") {
      if (data.cap == "3") {
        this.searchFilter.maVatTuCha = data.parent.parent.ma;
        this.searchFilter.tenVatTuCha = data.parent.parent.ten;
        this.searchFilter.maVatTu = data.parent.ma;
        this.searchFilter.tenVatTu = data.parent.ten;
      }
      if (data.cap == "2") {
        this.searchFilter.maVatTuCha = data.parent.ma;
        this.searchFilter.tenVatTuCha = data.parent.ten;
        this.searchFilter.maVatTu = data.ma;
        this.searchFilter.tenVatTu = data.ten;
      }
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
      soQdNhap: '',
      soBienBan: '',
      tenVatTuCha: '',
      maVatTuCha: '',
      tenVatTu: '',
      maVatTu: '',
      ngayTongHop: '',
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
          this.hoSoKyThuatService.deleteData(item.id).then((res) => {
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
          "maDonVi": this.userInfo.MA_DVI,
          "maVatTu": this.searchFilter.maVatTu,
          "maVatTuCha": this.searchFilter.maVatTuCha,
          "ngayKiemTraDenNgay": this.searchFilter.ngayTongHop && this.searchFilter.ngayTongHop.length > 1 ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD') : null,
          "ngayKiemTraTuNgay": this.searchFilter.ngayTongHop && this.searchFilter.ngayTongHop.length > 0 ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD') : null,
          "soBienBan": this.searchFilter.soBienBan,
          "soQdNhap": this.searchFilter.soQdNhap,
        };
        this.hoSoKyThuatService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-ho-so-ky-thuat.xlsx'),
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
            let res = await this.hoSoKyThuatService.deleteMultiple({ ids: dataDelete });
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

  filterInTable(key: string, value: string, date: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      console.log(this.dataTableAll);

      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (date) {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase() === dayjs(value).format('YYYY-MM-DD')) {
              temp.push(item)
            }
          });
        } else {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item)
            }
          });
        }
      }
      this.dataTable = [...this.dataTable, ...temp]
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }


  clearFilterTable() {
    this.filterTable = {
      soBienBan: '',
      soQuyetDinhNhap: '',
      ngayKiemTra: '',
      tenVatTuCha: '',
      tenVatTu: '',
      ketLuan: '',
    }
  }

  print() {

  }

}

