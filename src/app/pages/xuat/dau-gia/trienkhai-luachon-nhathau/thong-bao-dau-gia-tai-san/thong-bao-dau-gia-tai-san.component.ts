import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { ThongBaoDauGiaTaiSanService } from 'src/app/services/thongBaoDauGiaTaiSan.service';
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";

@Component({
  selector: 'app-thong-bao-dau-gia-tai-san',
  templateUrl: './thong-bao-dau-gia-tai-san.component.html',
  styleUrls: ['./thong-bao-dau-gia-tai-san.component.scss']
})
export class ThongBaoDauGiaTaiSanComponent implements OnInit {
  @Input() typeVthh: string;
  qdTCDT: string = MESSAGE.QD_TCDT;

  searchFilter = {
    namKeHoach: '',
    maVatTuCha: '',
    maDvi: '',
    soQuyetDinhPheDuyetKHBDG: '',
    maThongBaoBDG: '',
    trichYeu: '',
    ngayToChuc: '',
  };

  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  listNam: any[] = [];
  yearNow: number = 0;
  dsDonVi: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  listHangHoa: any[] = [];

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    qdPheDuyetKhbdg: '',
    maThongBao: '',
    thoiGianToChucDauGiaTuNgay: '',
    trichYeu: '',
    hinhThucDauGia: '',
    phuongThucDauGia: '',
    loaiHangHoa: '',
    namKeHoach: '',
  };

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    private thongBanDauGiaTaiSanService: ThongBaoDauGiaTaiSanService,
    public globals: Globals,
    private danhMucService: DanhMucService,
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
      await this.loadDsTong();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await this.search();
      await this.loaiVTHHGetAll();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (!this.typeVthh) {
        this.listHangHoa = res.data;
      }
      else {
        this.listHangHoa = res.data?.filter(x => x.ma == this.typeVthh);
      };
    }
  }

  async loadDsTong() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsDonVi = dsTong[DANH_MUC_LEVEL.CUC];
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
      "maThongBaoBDG": this.searchFilter.maThongBaoBDG,
      "maVatTuCha": this.searchFilter.maVatTuCha,
      "namKeHoach": this.searchFilter.namKeHoach,
      "maDvi": this.searchFilter.maDvi,
      "ngayToChucBDGDenNgay": this.searchFilter.ngayToChuc && this.searchFilter.ngayToChuc.length > 0
        ? dayjs(this.searchFilter.ngayToChuc[1]).format('YYYY-MM-DD')
        : null,
      "ngayToChucBDGTuNgay": this.searchFilter.ngayToChuc && this.searchFilter.ngayToChuc.length > 0
        ? dayjs(this.searchFilter.ngayToChuc[0]).format('YYYY-MM-DD')
        : null,
      "soQuyetDinhPheDuyetKHBDG": this.searchFilter.soQuyetDinhPheDuyetKHBDG,
      "trichYeu": this.searchFilter.trichYeu,
      "pageSize": this.pageSize,
      "pageNumber": this.page
    };
    let res = await this.thongBanDauGiaTaiSanService.timKiem(body);
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
      namKeHoach: '',
      maVatTuCha: '',
      maDvi: '',
      soQuyetDinhPheDuyetKHBDG: '',
      maThongBaoBDG: '',
      trichYeu: '',
      ngayToChuc: '',
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
          this.thongBanDauGiaTaiSanService.deleteData(item.id).then((res) => {
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
          "maThongBaoBDG": this.searchFilter.maThongBaoBDG && this.searchFilter.maThongBaoBDG != "" ? this.searchFilter.maThongBaoBDG : null,
          "maVatTuCha": this.searchFilter.maVatTuCha && this.searchFilter.maVatTuCha != "" ? this.searchFilter.maVatTuCha : null,
          "namKeHoach": this.searchFilter.namKeHoach && this.searchFilter.namKeHoach != "" ? this.searchFilter.namKeHoach : null,
          "ngayToChucBDGDenNgay": this.searchFilter.ngayToChuc && this.searchFilter.ngayToChuc.length > 0
            ? dayjs(this.searchFilter.ngayToChuc[1]).format('YYYY-MM-DD')
            : null,
          "ngayToChucBDGTuNgay": this.searchFilter.ngayToChuc && this.searchFilter.ngayToChuc.length > 0
            ? dayjs(this.searchFilter.ngayToChuc[0]).format('YYYY-MM-DD')
            : null,
          "soQuyetDinhPheDuyetKHBDG": this.searchFilter.soQuyetDinhPheDuyetKHBDG && this.searchFilter.soQuyetDinhPheDuyetKHBDG != "" ? this.searchFilter.soQuyetDinhPheDuyetKHBDG : null,
          "trichYeu": this.searchFilter.trichYeu && this.searchFilter.trichYeu != "" ? this.searchFilter.trichYeu : null,
        };
        this.thongBanDauGiaTaiSanService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-thong-bao-ban-dau-gia-tai-san.xlsx'),
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
            let res = await this.thongBanDauGiaTaiSanService.deleteMultiple({ ids: dataDelete });
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
          if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
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
      qdPheDuyetKhbdg: '',
      maThongBao: '',
      thoiGianToChucDauGiaTuNgay: '',
      trichYeu: '',
      hinhThucDauGia: '',
      phuongThucDauGia: '',
      loaiHangHoa: '',
      namKeHoach: '',
    }
  }

  print() {

  }
}
