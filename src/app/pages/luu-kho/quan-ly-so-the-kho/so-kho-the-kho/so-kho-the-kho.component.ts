import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from '../../luu-kho.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { QuanLySoKhoTheKhoService } from 'src/app/services/quan-ly-so-kho-the-kho.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-so-kho-the-kho',
  templateUrl: './so-kho-the-kho.component.html',
  styleUrls: ['./so-kho-the-kho.component.scss'],
})
export class SoKhoTheKhoComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  isDetail: false;

  formData: FormGroup;

  isAddNew = false;
  isView: boolean = true

  allChecked = false;
  indeterminate = false;

  filterDate = new Date();

  dsNam: string[] = []

  searchInTable: any = {
    nam: dayjs().get('year'),
    maDvi: "",
    tenDVi: "",
    loaiHH: "",
    maChungLoaiHang: "",
    ngayTao: ""
  }

  filterTable: any = {
    nam: null,
    tuNgay: null,
    denNgay: null,
    loaiHH: null,
    maChungLoaiHang: null,
    ngayTao: null,
    donVi: null,
    diemKho: null,
    nhaKho: null,
    nganKho: null,
    loKho: null,
    trangThai: null,
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();

  dataTable: any[] = [];
  dataTableAll: any[] = []

  idSelected: number = 0
  isCheck: boolean = false
  isStatus: any
  getCount = new EventEmitter<any>();

  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  dsDonVi: any = [];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private donviService: DonviService,
  ) { }
  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      await Promise.all([this.loadDsNam(), this.initData(), this.loaiVTHHGetAll(), this.search()]);
      this.spinner.hide();
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }
  initForm(): void {
    this.formData = this.fb.group({
      "nam": [null],
      "maDvi": [null],
      "tenDVi": [null],
      "loaiHang": [null],
      "maChungLoaiHang": [null],
      "ngayTao": [[]]
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
      if (this.userInfo.CAP_DVI === this.globals.prop.CUC) {
        this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      }
      if (this.userInfo.CAP_DVI === this.globals.prop.CHICUC) {
        this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
        this.formData.get('maDvi').setValue(this.dsDonVi[0].tenDvi)
        this.formData.controls['maDvi'].disable();
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
            }
            else {
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
    let loaiHangHoa = this.listLoaiHangHoa.filter(x => x.ma == this.formData.value.loaiHH);
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
          if (item.loaiHang.toString().toLowerCase() === data.ten.toString().toLowerCase()) {
            temp.push(item)
          }
        })
        this.isView = false
        this.dataTable = [...temp]
        if (this.dataTable.length > 0 && data.child.length > 0) {
          this.listChungLoaiHangHoa = data.child
        } else {
          this.isView = true
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
          if (item.chungLoaiHang.toString().toLowerCase() === data.ten.toString().toLowerCase()) {
            temp.push(item)
          }
        })
        this.dataTable = [...temp]
      }
    }
  }
  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
    }
  }
  async search() {
    this.spinner.show();
    let body = {
      "denNgay": "",
      "limit": this.pageSize, // cái này bằng 10 : PAGE_SIZE_DEFAULT
      "loaiHH": this.formData.value.loaiHH,
      "maChungLoaiHang": this.formData.value.maChungLoaiHang,
      "maDvi": (this.userInfo.CAP_DVI === this.globals.prop.CHICUC) ? this.detail.maDvi : this.formData.value.maDvi,
      "nam": this.formData.value.nam,
      "orderBy": "",
      "orderType": "",
      "page": this.page - 1, // cái này  1 - 1 = 0
      "tenDVi": this.formData.value.tenDVi,
      "tuNgay": ""
    }
    if (this.formData.value.ngayTao != null) {
      body.tuNgay = this.formData.value.ngayTao[0]
      body.denNgay = this.formData.value.ngayTao[1]
    }
    let res = await this.quanLySoKhoTheKhoService.timKiem(body);
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
  filterInTable(key: string, value: string, date: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
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
  clearFilter() {
    this.formData.reset()
    this.isView = true
    this.filterTable = {
      nam: null,
      tuNgay: null,
      denNgay: null,
      loaiHH: null,
      maChungLoaiHang: null,
      ngayTao: null,
      donVi: null,
      diemKho: null,
      nhaKho: null,
      nganKho: null,
      loKho: null,
      trangThai: null,
    };
    this.initData()
    this.search()
  }
  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show()
      try {
        let body = {
          "denNgay": "",
          "loaiHH": this.formData.value.loaiHH,
          "maChungLoaiHang": this.formData.value.maChungLoaiHang,
          "maDvi": this.formData.value.maDvi,
          "nam": this.formData.value.nam,
          "orderBy": "",
          "orderType": "",
          "tenDVi": this.formData.value.tenDVi,
          "tuNgay": "",
        }
        if (this.formData.value.ngayTao != null) {
          body.tuNgay = this.formData.value.ngayTao[0]
          body.denNgay = this.formData.value.ngayTao[1]
        }
        this.quanLySoKhoTheKhoService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-so-kho.xlsx')
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
          this.quanLySoKhoTheKhoService.deleteData(item).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
              this.getCount.emit();
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
  xoa() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id)
        }
      })
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
            let res = await this.quanLySoKhoTheKhoService.deleteMultiple({ ids: dataDelete });
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
      })
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
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
  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }
  viewDetail(id: number, check: boolean, status: any) {
    this.isAddNew = true;
    this.idSelected = id;
    this.isCheck = check
    this.isStatus = status
  }
  onClose() {
    this.isAddNew = false;
    this.search();
  }
}
