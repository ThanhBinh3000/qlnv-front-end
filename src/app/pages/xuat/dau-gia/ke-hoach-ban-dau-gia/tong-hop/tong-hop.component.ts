import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { STATUS } from "../../../../../constants/status";
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { TongHopDeXuatKeHoachBanDauGiaService } from 'src/app/services/tong-hop-de-xuat-ke-hoach-ban-dau-gia.service';

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
    private danhSachDauThauService: DanhSachDauThauService,
    private modal: NzModalService,
    public userService: UserService,
    private route: ActivatedRoute,
    private helperService: HelperService,
    public globals: Globals,
    private readonly danhMucService: DanhMucService,
  ) {
    this.danhMucDonVi = JSON.parse(sessionStorage.getItem('danhMucDonVi'));
  }
  @Input() loaiVthh: string;
  tabSelected: string = 'phuong-an-tong-hop';
  listNam: any[] = [];
  yearNow: number = 0;
  danhMucDonVi: any;

  searchFilter = {
    namKh: dayjs().get('year'),
    loaiVthh: '',
    tenLoaiVthh: '',
    noiDungThop: '',
    ngayThop: '',
    cloaiVthh: '',
    tenCloaiVthh: '',
  };

  filterTable: any = {
    id: '',
    ngayThop: '',
    noiDungThop: '',
    namKh: '',
    soQdPd: '',
    tenLoaiVthh: '',
    tenTrangThai: '',
  }

  dsLoaiHangHoa: any[] = [];

  STATUS = STATUS;
  dataTableAll: any[] = [];
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  dataTable: any[] = [];
  dataTableDanhSachDX: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  allChecked = false;
  indeterminate = false;

  async ngOnInit() {
    this.spinner.show();
    try {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP") || !this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_XEM")) {
        window.location.href = '/error/401'
      }
      this.userInfo = this.userService.getUserLogin();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.searchFilter.loaiVthh = this.loaiVthh;
      await this.search();
      await this.loaiVTHHGetAll();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiHangHoa = res.data;
    }
  }


  async search() {
    this.spinner.show();
    let body = {
      ngayThopTu: this.searchFilter.ngayThop
        ? dayjs(this.searchFilter.ngayThop[0]).format('YYYY-MM-DD')
        : null,
      ngayThopDen: this.searchFilter.ngayThop
        ? dayjs(this.searchFilter.ngayThop[1]).format('YYYY-MM-DD')
        : null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      loaiVthh: this.searchFilter.loaiVthh,

      namKh: this.searchFilter.namKh,
      noiDungThop: this.searchFilter.noiDungThop
    };
    let res = null;
    if (this.tabSelected == 'phuong-an-tong-hop') {
      res = await this.tongHopDeXuatKeHoachBanDauGiaService.search(body);
    } else if (this.tabSelected == 'danh-sach-tong-hop') {
      // Trạng thái đã tổng hợp
      res = await this.searchDanhSachDauThau(body, "05")
    } else {
      // Trạng thái chưa tổng hợp
      res = await this.searchDanhSachDauThau(body, "11")
    }
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (this.tabSelected == 'phuong-an-tong-hop') {
        this.dataTable = data.content;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
      } else {
        this.dataTableDanhSachDX = data.content;
        if (this.dataTableDanhSachDX && this.dataTableDanhSachDX.length > 0) {
          this.dataTableDanhSachDX.forEach((item) => {
            item.checked = false;
          });
        }
      }
      this.totalRecord = data.totalElements;
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async searchDanhSachDauThau(body, trangThai) {
    body.trangThai = trangThai
    return await this.danhSachDauThauService.search(body);
  }

  async selectTabData(tab: string) {
    this.spinner.show();
    try {
      this.tabSelected = tab;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  selectHangHoa() {
    // let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {

      this.searchFilter.cloaiVthh = data.ma
      this.searchFilter.tenCloaiVthh = data.ten
      this.searchFilter.loaiVthh = data.parent.ma
      this.searchFilter.tenLoaiVthh = data.parent.ten
      // this.searchFilter.patchValue({
      //   maVtu: null,
      //   tenVtu: null,

      // })
    }
    // if (data.loaiHang == "VT") {
    //   if (data.cap == "3") {
    //     cloaiVthh = data
    //     this.formTraCuu.patchValue({
    //       maVtu: data.ma,
    //       tenVtu: data.ten,
    //       cloaiVthh: data.parent.ma,
    //       tenCloaiVthh: data.parent.ten,
    //       loaiVthh: data.parent.parent.ma,
    //       tenVthh: data.parent.parent.ten
    //     })
    //   }
    //   if (data.cap == "2") {
    //     this.formTraCuu.patchValue({
    //       maVtu: null,
    //       tenVtu: null,
    //       cloaiVthh: data.ma,
    //       tenCloaiVthh: data.ten,
    //       loaiVthh: data.parent.ma,
    //       tenVthh: data.parent.ten
    //     })
    //   }
    // }
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

  showList() {
    this.isDetail = false;
    this.search();
  }

  themMoi() {
    if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_TONGHOP")) {
      return;
    }
    this.isDetail = true;
    this.selectedId = null;
  }

  redirectToChiTiet(isView: boolean, id: number) {
    if ((isView && !this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_XEM"))
      || (!isView && !this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_SUA"))) {
      return;
    }
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  calendarData(list, column) {
    let tongSL = 0;
    let tongTien = 0;
    if (list.length > 0) {
      // console.log(list);
      list.forEach(function (value) {
        tongSL += value.soLuong;
        tongTien += value.thanhTien;
      })
      return column == 'tong-tien' ? tongTien : tongSL;
    }
    return tongSL;
  }

  getTenDviTable(maDvi: string) {
    let donVi = this.danhMucDonVi?.filter(item => item.maDvi == maDvi);
    return donVi.length > 0 ? donVi[0].tenDvi : null
  }

  clearFilter() {
    this.searchFilter.namKh = dayjs().get('year');
    this.searchFilter.tenLoaiVthh = null;
    this.searchFilter.tenCloaiVthh = null;
    this.searchFilter.noiDungThop = null;
    this.searchFilter.ngayThop = null;
    this.search();
  }

  xoaItem(item: any) {
    if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_XOA")) {
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
          let body = {
            "id": item.id,
            "maDvi": ""
          }
          this.tongHopDeXuatKeHoachBanDauGiaService.delete(body).then(async () => {
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

  convertDay(day: string) {
    if (day && day.length > 0) {
      return dayjs(day).format('DD/MM/YYYY');
    }
    return '';
  }

  // convertTrangThai(status: string) {
  //   switch (status) {
  //     case STATUS.CHUA_TAO_QD: {
  //       return 'Chưa tạo QĐ'
  //     }
  //     case STATUS.DA_DU_THAO_QD: {
  //       return 'Đã dự thảo QĐ'
  //     }
  //     case STATUS.DA_BAN_HANH_QD: {
  //       return 'Đã ban hành QĐ'
  //     }
  //   }
  // }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayThopTu: this.searchFilter.ngayThop
            ? dayjs(this.searchFilter.ngayThop[0]).format('YYYY-MM-DD')
            : null,
          ngayThopDen: this.searchFilter.ngayThop
            ? dayjs(this.searchFilter.ngayThop[1]).format('YYYY-MM-DD')
            : null,
          loaiVthh: this.searchFilter.loaiVthh,
          namKhoach: this.searchFilter.namKh,
          noiDungThop: this.searchFilter.noiDungThop
        };
        this.tongHopDeXuatKeHoachBanDauGiaService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-tong-hop-ke-hoach-lcnt.xlsx'),
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

  dateChange() {
    this.helperService.formatDate()
  }

  deleteSelect() {
    if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_XOA")) {
      return;
    }
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
            let res = await this.tongHopDeXuatKeHoachBanDauGiaService.deleteMuti({ idList: dataDelete });
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
      id: '',
      ngayThop: '',
      noiDungThop: '',
      namKh: '',
      soQdPd: '',
      tenLoaiVthh: '',
      tenTrangThai: '',
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == STATUS.CHUA_TAO_QD) {
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
}
