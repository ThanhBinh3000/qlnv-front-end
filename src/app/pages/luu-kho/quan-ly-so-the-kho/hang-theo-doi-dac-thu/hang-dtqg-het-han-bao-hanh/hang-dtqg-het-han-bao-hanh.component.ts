import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/services/user.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MESSAGE } from 'src/app/constants/message';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { isEmpty } from 'lodash';
import { HangDtqgHetHanBaoHanhService } from 'src/app/services/hangthuocdientheodoidacthu/hang-dtqg-het-han-bao-hanh.service';
import { cloneDeep } from 'lodash';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-hang-dtqg-het-han-bao-hanh',
  templateUrl: './hang-dtqg-het-han-bao-hanh.component.html',
  styleUrls: ['./hang-dtqg-het-han-bao-hanh.component.scss'],
})
export class HangDtqgHetHanBaoHanhComponent implements OnInit {
  userInfo: UserLogin;
  formData: FormGroup;

  searchInTable: any = {
    "maChungLoaiHang": "",
    "maDonVi": "",
    "maLoaiHang": "",
  };

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  filterTable: any = {
    tenDonVi: null,
    loaiHangHoa: null,
    chungLoaiHangHoa: null,
    diemKho: null,
    nhaKho: null,
    nganKho: null,
    loKho: null,
    ngayNhapKho: null,
    ngayHetHanBaoHanh: null,
  };
  constructor(
    private readonly fb: FormBuilder,
    private readonly donviService: DonviService,
    private readonly spinner: NgxSpinnerService,
    private readonly notification: NzNotificationService,
    private readonly userService: UserService,
    private readonly danhMucService: DanhMucService,
    private hangDtqgHetHanBaoHanhService: HangDtqgHetHanBaoHanhService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      // await this.initData();
      this.search()
      // this.dataTable = [...this.dataExample];
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      "maChungLoaiHang": [null],
      "maDonVi": [null],
      "maLoaiHang": [null],
    })
  }
  async search() {
    this.spinner.show();

    let body = {
      "maChungLoaiHang": this.formData.value.maChungLoaiHang,
      "maDonVi": this.formData.value.maDonVi,
      "maLoaiHang": this.formData.value.maLoaiHang,
      "paggingReq": {
        "limit": this.pageSize,
        "orderBy": "",
        "orderType": "",
        "page": this.page - 1,
      }

    }
    let res = await this.hangDtqgHetHanBaoHanhService.search(body);
    console.log(res.data.content);

    if (res.msg = MESSAGE.SUCCESS) {
      this.dataTable = res.data.content
      this.totalRecord = res.data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach(item => item.checked = false)
      }
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg)
    }
    this.spinner.hide()
  }


  filterInTable(key: string, value: string, date: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (date) {
          console.log(dayjs(value).format('DD/MM/YYYY'));
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase() == dayjs(value).format('DD/MM/YYYY')) {
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
        console.log(temp);

      }
      this.dataTable = [...this.dataTable, ...temp]
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }
  clearFilter() {
    this.formData.reset();
    this.search()
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show()
      try {
        let body = this.formData.value;
        if (body.ngayTao != null) {
          body.tuNgay = body.ngayTao[0]
          body.denNgay = body.ngayTao[1]
        }
        this.hangDtqgHetHanBaoHanhService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-hh-het-han-bh-con-luu-kho.xlsx')
        });

        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY)
    }

  }
  // async initData() {
  //   this.userInfo = this.userService.getUserLogin();
  //   this.detail.maDvi = this.userInfo.MA_DVI;
  //   this.detail.tenDvi = this.userInfo.TEN_DVI;
  //   await Promise.all([this.loadDsTong(), this.loaiVTHHGetAll()]);
  // }

  // async loadDsTong() {
  //   const body = {
  //     maDviCha: this.detail.maDvi,
  //     trangThai: '01',
  //   };

  //   const dsTong = await this.donviService.layDonViTheoCapDo(body);
  //   if (!isEmpty(dsTong)) {
  //     this.dsTong = dsTong;
  //     this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
  //     this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
  //   }
  // }

  // async loaiVTHHGetAll() {
  //   let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     this.dsLoaiHangHoa = res.data;
  //     this.dsLoaiHangHoaDataSource = res.data?.map((item) => item.giaTri);
  //   }
  // }

  // onChangeAutoComplete(e) {
  //   const value = (e.target as HTMLInputElement).value;
  //   if (value) {
  //     this.dsDonViDataSource = this.dsDonVi
  //       .filter((item) =>
  //         item?.tenDvi?.toLowerCase()?.includes(value.toLowerCase()),
  //       )
  //       .map((item) => item.tenDvi);
  //   } else {
  //     this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
  //   }
  // }

  // onChangeAutoCompleteLoaiHH(e) {
  //   const value = (e.target as HTMLInputElement).value;
  //   if (value) {
  //     this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa
  //       .filter((item) =>
  //         item?.giaTri?.toLowerCase()?.includes(value.toLowerCase()),
  //       )
  //       .map((item) => item.giaTri);
  //   } else {
  //     this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa.map(
  //       (item) => item.giaTri,
  //     );
  //   }
  // }



  // onChangeDonVi(id) {
  //   const chiCuc = this.dsDonVi.find((item) => item.id === Number(id));
  //   if (chiCuc) {
  //     const result = {
  //       ...this.donviService.layDsPhanTuCon(this.dsTong, chiCuc),
  //     };
  //     this.dsDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
  //   } else {
  //     this.dsDiemKho = [];
  //   }
  // }

  // onChangeDiemKho(id) {
  //   const diemKho = this.dsDiemKho.find((item) => item.id === Number(id));
  //   if (diemKho) {
  //     const result = {
  //       ...this.donviService.layDsPhanTuCon(this.dsTong, diemKho),
  //     };
  //     this.dsNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
  //   } else {
  //     this.dsNhaKho = [];
  //   }
  // }

  // onChangeNhaKho(id) {
  //   const nhaKho = this.dsNhaKho.find((item) => item.id === Number(id));
  //   if (nhaKho) {
  //     const result = {
  //       ...this.donviService.layDsPhanTuCon(this.dsTong, nhaKho),
  //     };
  //     this.dsNganLo = result[DANH_MUC_LEVEL.NGAN_LO];
  //   } else {
  //     this.dsNganLo = [];
  //   }
  // }

  onChangeFilterDate(event) {}

  changePageIndex(event) {}

  changePageSize(event) {}
}

interface ITrangThai {
  id: number;
  giaTri: string;
}

interface IHangDTQGHetHanBaoHanh {
  id: number;
  idDonVi: number;
  tenDonVi: string;
  idLoaiHangHoa: number;
  tenLoaiHangHoa: string;
  idHangHoa: number;
  tenHangHoa: string;
  idDiemKho: number;
  tenDiemKho: string;
  idNhaKho: number;
  tenNhaKho: string;
  idNganLo: number;
  tenNganLo: string;
  ngayNhap: Date;
  ngayHetHanBaoHanh: Date;
  soLuong: number;
  donVi: string;
}
