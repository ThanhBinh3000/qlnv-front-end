import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/constants/message';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
import { HangSapHetHanLkChuaXuatKhoService } from 'src/app/services/hangthuocdientheodoidacthu/hang-sap-het-han-lk-chua-xuat-kho.service';
import { cloneDeep } from 'lodash';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-hang-sap-het-han-luu-kho',
  templateUrl: './hang-sap-het-han-luu-kho.component.html',
  styleUrls: ['./hang-sap-het-han-luu-kho.component.scss'],
})
export class HangSapHetHanLuuKhoComponent implements OnInit {
  userInfo: UserLogin;
  formData: FormGroup;
  dataSearch: any = {
    "maChungLoaiHang": "",
    "maDonVi": "",
    "maLoaiHang": "",
  };

  filterTable: any = {
    tenDonVi: null,
    loaiHangHoa: null,
    chungLoaiHangHoa: null,
    diemKho: null,
    nhaKho: null,
    nganKho: null,
    loKho: null,
    ngayNhapKho: null,
    ngayHetHanLuuKho: null,
  };

  isView: boolean = true;
  detail: any = {}
  dsTong: any = []
  dsDonVi: any = []
  dsLoaiHangHoa: any[] = [];
  dsChungLoaiHangHoa: any[] = [];
  dsLoaiHangHoaDataSource = [];
  dsChungLoaiHangHoaDataSource = [];

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  constructor(
    private fb: FormBuilder,
    private donviService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private danhMucService: DanhMucService,
    private globals: Globals,
    private hangSapHetHanLkChuaXuatKhoService: HangSapHetHanLkChuaXuatKhoService,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm()
      await Promise.all([this.initData(), this.loaiVTHHGetAll(), this.search()])
      this.spinner.hide();
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
    } finally {
      this.spinner.hide();
    }
  }
  initForm(): void {
    this.formData = this.fb.group({
      'maDonVi': [null],
      'maLoaiHang': [null],
      'maChungLoaiHang': [null],
    })
  }
  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong()
  }
  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangthai: '01',
    }
    const dsTong = await this.donviService.layDonViTheoCapDo(body)
    if (!isEmpty(dsTong)) {
      this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC]
      if (this.userInfo.CAP_DVI === this.globals.prop.CHICUC) {
        if (this.userInfo.CAP_DVI === this.globals.prop.CHICUC) {
          this.formData.get('maDonVi').setValue(this.dsDonVi[0].tenDvi)
          this.formData.controls['maDonVi'].disable();
        }
      }
    }
  }
  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, item];
              this.onChangeLoaiHHAutoComplete('')
            }
            else {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, ...item.child];
            }
          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);

    }
  }
  async changeLoaiHangHoa() {
    let loaiHangHoa = this.dsLoaiHangHoa.filter(x => x.ma == this.formData.value.maLoaiHang);
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      this.dsChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }
  onChangeLoaiHH(id: any) {
    if (id && id !== '') {
      this.dsChungLoaiHangHoa = []
      let data = this.dsLoaiHangHoa.find(item => item.ma === id)
      let temp = []
      if (data != undefined) {
        this.dataTableAll.forEach(item => {
          if (item.loaiHangHoa.toString().toLowerCase() === data.ten.toString().toLowerCase()) {
            temp.push(item)
          }
        })
        this.isView = false
        this.dataTable = [...temp]
        if (this.dataTable.length > 0 && data.child.length > 0) {
          this.dsChungLoaiHangHoa = data.child
        } else {
          this.isView = true
        }
      }
    }
  }
  onChangeChungLoaiHH(id: any) {
    if (id && id !== '') {
      let data = this.dsChungLoaiHangHoa.find(item => item.ma === id)
      let temp = []
      if (data != undefined) {
        this.dataTableAll.forEach(item => {
          if (item.chungLoaiHangHoa.toString().toLowerCase() === data.ten.toString().toLowerCase()) {
            temp.push(item)
          }
        })
        this.dataTable = [...temp]
      }
    }
  }
  onChangeLoaiHHAutoComplete(value: any) {
    this.dsChungLoaiHangHoaDataSource = []
    this.formData.get('maChungLoaiHang').setValue('')
    if (value) {
      this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa
        .filter((item) => item?.ten?.toLowerCase()?.includes(value.toString().toLowerCase()),)
        .map((item) => item.ten);
      let data = this.dsLoaiHangHoa.find((item) => item.ten.toString().toLowerCase() == this.formData.value.maLoaiHang.toString().toLowerCase())
      if (data && data.child.length > 0 && data !== undefined) {
        this.dsChungLoaiHangHoa = data.child
        this.dsChungLoaiHangHoaDataSource = this.dsChungLoaiHangHoa.map((item => item.ten))
        this.dataSearch.maLoaiHang = data.ma
      } else {
        this.formData.get('maChungLoaiHang').setValue('')
        this.dsChungLoaiHangHoaDataSource = []
      }
    } else {
      this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa.map(
        (item) => item.ten,
      );
    }
  }
  onChangeChungLoaiHHAutoComplete(value: any) {
    if (value) {
      let data = this.dsChungLoaiHangHoa.find((item) => item.ten.toString().toLowerCase() == this.formData.value.maChungLoaiHang.toString().toLowerCase())
      if (data !== undefined) {
        this.dataSearch.maChungLoaiHang = data.ma
      } else {
        this.dataSearch.maChungLoaiHang = this.formData.value.maChungLoaiHang
      }
    } else {
      this.dataSearch.maChungLoaiHang = this.formData.value.maChungLoaiHang
      this.dsChungLoaiHangHoaDataSource = this.dsChungLoaiHangHoa.map(
        (item) => item.ten,
      );
    }
  }
  async search() {
    this.spinner.show();
    let body = {
      "maChungLoaiHang": this.dataSearch.maChungLoaiHang,
      "maDonVi": this.formData.value.maDonVi,
      "maLoaiHang": this.dataSearch.maLoaiHang,
      "tenDonVi": "",
      "paggingReq": {
        "limit": this.pageSize,
        "orderBy": "",
        "orderType": "",
        "page": this.page - 1,
      }
    }

    let res = await this.hangSapHetHanLkChuaXuatKhoService.search(body);
    if (res.msg = MESSAGE.SUCCESS) {
      this.dataTable = [...res.data.content]
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
      }
      this.dataTable = [...this.dataTable, ...temp]
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
  clearFilter() {
    this.formData.reset();
    this.isView = true
    this.filterTable = {
      tenDonVi: null,
      loaiHangHoa: null,
      chungLoaiHangHoa: null,
      diemKho: null,
      nhaKho: null,
      nganKho: null,
      loKho: null,
      ngayNhapKho: null,
      ngayHetHanLuuKho: null,
    };
    this.dataSearch = {
      maChungLoaiHang: null,
      maDonVi: null,
      maLoaiHang: null,
    };
    this.dsChungLoaiHangHoaDataSource = []
    this.initData()
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
        this.hangSapHetHanLkChuaXuatKhoService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-hh-het-han-lk-chua-kh-xuat-kho.xlsx')
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
}
