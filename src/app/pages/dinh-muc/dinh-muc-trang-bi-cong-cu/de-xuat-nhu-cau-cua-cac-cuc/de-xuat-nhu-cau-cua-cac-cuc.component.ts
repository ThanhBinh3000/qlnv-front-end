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
import { QuanLyBienBanChuanBiKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanChuanBiKho.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemTraChatLuongHang.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-de-xuat-nhu-cau-cua-cac-cuc',
  templateUrl: './de-xuat-nhu-cau-cua-cac-cuc.component.html',
  styleUrls: ['./de-xuat-nhu-cau-cua-cac-cuc.component.scss']
})
export class DeXuatNhuCauCuaCacCucComponent implements OnInit {

  @Input() typeVthh: string;
  qdTCDT: string = MESSAGE.QD_TCDT;

  searchFilter = {
    soQuyetDinhNhap: '',
    soBienBan: '',
    ngayBienBan: '',
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
    chungLoaiHangHoa: '',
    loaiHangHoa: '',
    ngay: '',
    soQuyetDinh: '',
    soBienBan: '',
    diemKho: '',
    nhaKho: '',
    nganLo: '',
    trangThai: '',
  };

  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  itemRow: any = {};

  constructor(
    private spinner: NgxSpinnerService,
    private bienBanChuanBiKhoService: QuanLyBienBanChuanBiKhoService,
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
    let body = {
      "capDvis": '3',
      "ngayBienBanTu": this.searchFilter.ngayBienBan && this.searchFilter.ngayBienBan.length > 1
        ? dayjs(this.searchFilter.ngayBienBan[0]).format('YYYY-MM-DD')
        : null,
      "ngayBienBanDen": this.searchFilter.ngayBienBan && this.searchFilter.ngayBienBan.length > 0
        ? dayjs(this.searchFilter.ngayBienBan[1]).format('YYYY-MM-DD')
        : null,
      "pageSize": this.pageSize,
      "pageNumber": this.page,
      "soBienBan": this.searchFilter.soBienBan,
      "soQdNhap": this.searchFilter.soQuyetDinhNhap
    };
    let res = await this.bienBanChuanBiKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item, index) => {
          item.checked = false;
          item.stt = index + 1;
        });
        this.updateEditCache();
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
          this.bienBanChuanBiKhoService.delete(item.id).then((res) => {
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
          "maHangHoa": this.typeVthh,
          "maNganKho": null,
          "ngayKiemTraDenNgay": this.searchFilter.ngayBienBan && this.searchFilter.ngayBienBan.length > 1
            ? dayjs(this.searchFilter.ngayBienBan[1]).format('YYYY-MM-DD')
            : null,
          "ngayKiemTraTuNgay": this.searchFilter.ngayBienBan && this.searchFilter.ngayBienBan.length > 0
            ? dayjs(this.searchFilter.ngayBienBan[0]).format('YYYY-MM-DD')
            : null,
          "ngayLapPhieu": null,
          "orderBy": null,
          "orderDirection": null,
          "paggingReq": null,
          "soBienBan": this.searchFilter.soBienBan,
          "soQd": this.searchFilter.soQuyetDinhNhap,
          "str": null,
          "tenNguoiGiao": null,
          "trangThai": null
        };
        this.bienBanChuanBiKhoService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-chuan-bi-kho.xlsx'),
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
            let res = await this.bienBanChuanBiKhoService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.allChecked = false;
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
      chungLoaiHangHoa: '',
      loaiHangHoa: '',
      ngay: '',
      soQuyetDinh: '',
      soBienBan: '',
      diemKho: '',
      nhaKho: '',
      nganLo: '',
      trangThai: '',
    }
  }

  print() {

  }

  updateEditCache(): void {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        this.editCache[item.stt] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  cancelEdit(id: number): void {
    const index = this.dataTable.findIndex(item => item.stt === id);
    this.editCache[id] = {
      data: { ...this.dataTable[index] },
      edit: false
    };
  }

  saveEdit(id: number): void {
    const index = this.dataTable.findIndex(item => item.stt === id);
    Object.assign(this.dataTable[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  addRow() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.itemRow);
    item.stt = this.dataTable.length + 1;
    this.dataTable = [
      ...this.dataTable,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.itemRow = {};
  }

  deleteRow(data: any) {
    this.dataTable = this.dataTable.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(id: number) {
    this.editCache[id].edit = true;
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }
}
