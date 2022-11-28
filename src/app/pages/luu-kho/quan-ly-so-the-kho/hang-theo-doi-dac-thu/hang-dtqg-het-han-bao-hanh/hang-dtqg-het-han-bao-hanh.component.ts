import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {UserLogin} from 'src/app/models/userlogin';
import {DonviService} from 'src/app/services/donvi.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {UserService} from 'src/app/services/user.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {MESSAGE} from 'src/app/constants/message';
import {DANH_MUC_LEVEL} from 'src/app/pages/luu-kho/luu-kho.constant';
import {isEmpty} from 'lodash';
import {
  HangDtqgHetHanBaoHanhService
} from 'src/app/services/hangthuocdientheodoidacthu/hang-dtqg-het-han-bao-hanh.service';
import {cloneDeep} from 'lodash';
import * as dayjs from 'dayjs';
import {saveAs} from 'file-saver';
import {Globals} from 'src/app/shared/globals';


@Component({
  selector: 'app-hang-dtqg-het-han-bao-hanh',
  templateUrl: './hang-dtqg-het-han-bao-hanh.component.html',
  styleUrls: ['./hang-dtqg-het-han-bao-hanh.component.scss'],
})
export class HangDtqgHetHanBaoHanhComponent implements OnInit {
  userInfo: UserLogin;
  formData: FormGroup;

  dataSearch: any = {
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

  detail: any = {}
  dsTong: any = []
  dsDonVi: any = []
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  dsLoaiHangHoaDataSource = [];
  dsChungLoaiHangHoaDataSource = [];


  constructor(
    private fb: FormBuilder,
    private donviService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private danhMucService: DanhMucService,
    private hangDtqgHetHanBaoHanhService: HangDtqgHetHanBaoHanhService,
    public globals: Globals,
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      await Promise.all([this.initData(), this.loaiVTHHGetAll(), this.search()]);
      this.spinner.hide();
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

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      if (this.userInfo.CAP_DVI === this.globals.prop.CHICUC) {
        this.formData.get('maDonVi').setValue(this.dsDonVi[0].tenDvi)
        this.formData.controls['maDonVi'].disable();
      }
    }
  }

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, item];
              this.onChangeLoaiHHAutoComplete('')
            } else {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, ...item.child];
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
    let loaiHangHoa = this.listLoaiHangHoa.filter(x => x.ma == this.formData.value.maLoaiHang);
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }

  onChangeLoaiHH(id: any) {
    if (id && id !== '') {
      this.listChungLoaiHangHoa = []
      let data = this.listLoaiHangHoa.find(item => item.ma === id)
      let temp = []
      if (data != undefined) {
        this.dataTableAll.forEach(item => {
          if (item.loaiHangHoa.toString().toLowerCase() === data.ten.toString().toLowerCase()) {
            temp.push(item)
          }
        })
        this.dataTable = [...temp]
        if (this.dataTable.length > 0 && data.child.length > 0) {
          this.listChungLoaiHangHoa = data.child
        }
      }
    }
  }

  onChangeChungLoaiHH(id: any) {
    if (id && id !== '') {
      let data = this.listChungLoaiHangHoa.find(item => item.ma === id)
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

  async search() {
    this.spinner.show();
    let body = {
      "maChungLoaiHang": this.dataSearch.maChungLoaiHang,
      "maDonVi": this.formData.value.maDonVi,
      "maLoaiHang": this.dataSearch.maLoaiHang,
      "paggingReq": {
        "limit": this.pageSize,
        "orderBy": "",
        "orderType": "",
        "page": this.page - 1,
      }
    }
    let res = await this.hangDtqgHetHanBaoHanhService.search(body);
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
            if (item[key] && dayjs(item[key].toString().toLowerCase()).format('dd/MM/YYYY') == dayjs(value).format('dd/MM/YYYY')) {
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

  clearFilter() {
    this.formData.reset();
    this.filterTable = {
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
        let body = {
          "maChungLoaiHang": this.dataSearch.maChungLoaiHang,
          "maDonVi": this.formData.value.maDonVi,
          "maLoaiHang": this.dataSearch.maLoaiHang,
          "paggingReq": {
            "limit": this.pageSize,
            "orderBy": "",
            "orderType": "",
            "page": this.page - 1,
          }
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

  onChangeLoaiHHAutoComplete(value: any) {
    this.dsChungLoaiHangHoaDataSource = []
    this.formData.get('maChungLoaiHang').setValue('')
    if (value) {
      this.dsLoaiHangHoaDataSource = this.listLoaiHangHoa
        .filter((item) => item?.ten?.toLowerCase()?.includes(value.toString().toLowerCase()),)
        .map((item) => item.ten);
      let data = this.listLoaiHangHoa.find((item) => item.ten.toString().toLowerCase() == this.formData.value.maLoaiHang.toString().toLowerCase())
      if (data && data.child.length > 0 && data !== undefined) {
        this.listChungLoaiHangHoa = data.child
        this.dsChungLoaiHangHoaDataSource = this.listChungLoaiHangHoa.map((item => item.ten))
        this.dataSearch.maLoaiHang = data.ma
      } else {
        this.formData.get('maChungLoaiHang').setValue('')
        this.dsChungLoaiHangHoaDataSource = []
      }
    } else {
      this.dsLoaiHangHoaDataSource = this.listLoaiHangHoa.map(
        (item) => item.ten,
      );
    }
  }

  onChangeChungLoaiHHAutoComplete(value: any) {
    if (value) {
      let data = this.listChungLoaiHangHoa.find((item) => item.ten.toString().toLowerCase() == this.formData.value.maChungLoaiHang.toString().toLowerCase())
      if (data !== undefined) {
        this.dataSearch.maChungLoaiHang = data.ma
      } else {
        this.dataSearch.maChungLoaiHang = this.formData.value.maChungLoaiHang
      }
    } else {
      this.dataSearch.maChungLoaiHang = this.formData.value.maChungLoaiHang
      this.dsChungLoaiHangHoaDataSource = this.listChungLoaiHangHoa.map(
        (item) => item.ten,
      );
    }
  }
}
