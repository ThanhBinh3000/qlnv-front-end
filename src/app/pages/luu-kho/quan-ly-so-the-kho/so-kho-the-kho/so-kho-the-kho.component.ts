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
import {STATUS} from "../../../../constants/status";
@Component({
  selector: 'app-so-kho-the-kho',
  templateUrl: './so-kho-the-kho.component.html',
  styleUrls: ['./so-kho-the-kho.component.scss'],
})
export class SoKhoTheKhoComponent implements OnInit {

  userInfo: UserLogin;
  detail: any = {};
  isDetail: false;
  isView: boolean;

  formData: FormGroup;

  isAddNew = false;

  allChecked = false;
  indeterminate = false;

  STATUS = STATUS;

  filterDate = new Date();

  dsNam: any[] = []

  searchInTable: any = {
    nam: "",
    maDvi: "",
    tenDVi: "",
    loaiHang: "",
    maChungLoaiHang: "",
    ngayTao: ""
  }

  filterTable: any = {
    nam: null,
    tuNgay: null,
    denNgay: null,
    loaiHang: null,
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
  ) {
    this.formData = this.fb.group({
      nam: [null],
      maDvi: [null],
      tenDVi: [null],
      loaiHang: [null],
      maChungLoaiHang: [null],
      ngayTao: [null],
    })
  }
  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadDsNam(),
        this.initData(),
        this.loaiVTHHGetAll(),
        this.search()
        ])
      this.spinner.hide();
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }
  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI ? this.userInfo.TEN_DVI : null;
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
  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      this.formData.patchValue({
        maChungLoaiHang  :null
      })
      let loaiHangHoa = this.listLoaiHangHoa.filter(item => item.ma === id);
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
    for (let i = -5; i < 5; i++) {
      this.dsNam.push((thisYear - i));
    }
    this.formData.patchValue({
      nam : dayjs().get('year')
    })
  }
  async search() {
    this.spinner.show();
    let body = this.formData.value
    if (this.formData.value.ngayTao) {
      body.tuNgay = this.formData.value.ngayTao[0]
      body.denNgay = this.formData.value.ngayTao[1]
    }
    body.maDvi = this.userInfo.MA_DVI;
    let res = await this.quanLySoKhoTheKhoService.timKiem(body);
    if (res.msg = MESSAGE.SUCCESS) {
      this.dataTable = res.data;
      console.log(this.dataTable)
    } else {
      this.notification.error(MESSAGE.ERROR, "Lỗi hệ thống!")
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
      this.spinner.show()
      try {
        let body = this.formData.value
        if (this.formData.value.ngayTao) {
          body.tuNgay = this.formData.value.ngayTao[0]
          body.denNgay = this.formData.value.ngayTao[1]
        }
        body.maDvi = this.userInfo.MA_DVI;
        this.quanLySoKhoTheKhoService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-so-kho.xlsx')
        });
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
  viewDetail(id: number, isView: boolean) {
    this.isAddNew = true;
    this.idSelected = id;
    this.isView = isView
  }
  onClose() {
    this.isAddNew = false;
    this.search();
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}
