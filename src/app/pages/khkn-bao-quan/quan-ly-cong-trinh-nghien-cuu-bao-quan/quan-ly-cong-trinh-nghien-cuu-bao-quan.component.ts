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
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { KhCnCongTrinhNghienCuu } from 'src/app/services/kh-cn-bao-quan/khCnCongTrinhNghienCuu';
import { STATUS } from 'src/app/constants/status';
@Component({
  selector: 'app-quan-ly-cong-trinh-nghien-cuu-bao-quan',
  templateUrl: './quan-ly-cong-trinh-nghien-cuu-bao-quan.component.html',
  styleUrls: ['./quan-ly-cong-trinh-nghien-cuu-bao-quan.component.scss']
})
export class QuanLyCongTrinhNghienCuuBaoQuanComponent implements OnInit {

  @Input() typeVthh: string;
  qdTCDT: string = MESSAGE.QD_TCDT;

  searchFilter = {
    maDeTai: '',
    tenDeTai: '',
    capDeTai: '',
    trangThai: '',
    thoiGian: '',

  };

  filterTable: any = {
    maDeTai: '',
    tenDeTai: '',
    capDeTai: '',
    ngayKyTu: '',
    ngayKyDen: '',
    tenTrangThai: '',
  };
  listCapDt: any[] = []
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
  listHangHoa: any[] = [];

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;
  tenCapDt: any[] = [];
  STATUS = STATUS
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_NGHIEM_THU, giaTri: 'Đã nghiệm thu' }
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private khCnCongTrinhNghienCuu: KhCnCongTrinhNghienCuu,
  ) { }

  async ngOnInit() {
    // if (!this.userService.isAccessPermisson('KHCNBQ_CTNCKHCNBQ')) {
    //   this.router.navigateByUrl('/error/401')
    // }
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
      await this.getListCapDt();
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
  async getListCapDt() {
    this.listCapDt = [];
    let res = await this.danhMucService.danhMucChungGetAll('CAP_DE_TAI');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCapDt = res.data;
    }
  }
  onChangeCapDeTai(capDetai) {
    // const tt = this.listCapDt.filter(s => s.ma == capDetai);
    // if (tt.length > 0) {
    //   this.tenCapDt = tt[0].giaTri;
    // }
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
    this.spinner.show();
    console.log(this.searchFilter.thoiGian);
    try {
      let body = {
        maDeTai: this.searchFilter.maDeTai,
        tenDeTai: this.searchFilter.tenDeTai,
        capDeTai: this.searchFilter.capDeTai,
        trangThai: this.searchFilter.trangThai,
        thoiGianTu: this.searchFilter.thoiGian
          ? dayjs(this.searchFilter.thoiGian[0]).startOf('month')
          : null,
        thoiGianDen: this.searchFilter.thoiGian
          ? dayjs(this.searchFilter.thoiGian[1]).endOf('month')
          : null,
        paggingReq: {
          limit: this.pageSize,
          page: this.page - 1,
        }
      };
      let res = await this.khCnCongTrinhNghienCuu.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
            const tt = this.listCapDt.find(s => s.ma == item.capDeTai);
            if (tt) {
              this.tenCapDt = tt.giaTri;
              Object.assign(item, { tenCapDt: this.tenCapDt })
            }
          });
        }
        this.dataTableAll = cloneDeep(this.dataTable);
        this.totalRecord = data.totalElements;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log(e)
      this.spinner.hide();
    }

  }

  async clearFilter() {
    this.searchFilter = {
      maDeTai: '',
      tenDeTai: '',
      capDeTai: '',
      trangThai: '',
      thoiGian: '',

    };
    this.search();
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
          this.khCnCongTrinhNghienCuu.delete({ id: item.id }).then((res) => {
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

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          maDeTai: this.searchFilter.maDeTai,
          tenDeTai: this.searchFilter.tenDeTai,
          capDeTai: this.searchFilter.capDeTai,
          trangThai: this.searchFilter.trangThai,
        };
        this.khCnCongTrinhNghienCuu
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-cong-trinh-nghien-cuu.xlsx'),
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
        console.log(item.checked, "hh");
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
            let res = await this.khCnCongTrinhNghienCuu.deleteMuti({ idList: dataDelete });
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
          if (['ngayKyTu', 'ngayKyDen'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          }
          else {
            if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
              temp.push(item)
            }
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

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('MM/YYYY').toString()
    }
    return result;
  }
}
