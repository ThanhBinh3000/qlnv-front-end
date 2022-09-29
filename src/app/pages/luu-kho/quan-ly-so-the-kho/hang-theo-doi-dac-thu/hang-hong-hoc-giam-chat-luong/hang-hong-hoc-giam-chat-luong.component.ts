import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { isEmpty } from 'lodash';
import { QuanLyDanhSachHangHongHocService } from 'src/app/services/quanLyDanhSachHangHongHoc.service';
import { cloneDeep } from 'lodash';
import * as dayjs from 'dayjs';


@Component({
  selector: 'app-hang-hong-hoc-giam-chat-luong',
  templateUrl: './hang-hong-hoc-giam-chat-luong.component.html',
  styleUrls: ['./hang-hong-hoc-giam-chat-luong.component.scss'],
})
export class HangHongHocGiamChatLuongComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  isAddNew = false;

  formData: FormGroup;

  allChecked = false;
  indeterminate = false;

  filterDate = new Date();

  dsTong;
  dsDonVi = [];
  dsDonViDataSource = [];
  dsHangHoa = [];
  dsLoaiHangHoa = [];
  dsLoaiHangHoaDataSource = [];

  searchInTable: any = {
    maDanhSach: null,
    donVi: null,
    ngayTao: new Date(),
    trangThai: null,
  };
  filterTable: any = {
    maDS: [null],
    tenDVi: [null],
    ngayTao: [null],
    trangThaiXL: [null],
  }

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;

  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly donviService: DonviService,
    private readonly danhMucService: DanhMucService,
    private readonly spinner: NgxSpinnerService,
    private readonly notification: NzNotificationService,
    private quanLyDanhSachHangHongHocService: QuanLyDanhSachHangHongHocService,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      await this.initData();

      await this.search()
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      "maDonVi": [null],
      "maVTHH": [null],
      "ngayTao": [null]
    });
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await Promise.all([this.loadDsTong(), this.loaiVTHHGetAll()]);
  }

  async search() {
    this.spinner.show();
    let body = {
      "denNgay": '',
      "maDonVi": this.formData.value.maDonVi,
      "maVTHH": this.formData.value.maVTHH,
      "paggingReq": {
        "limit": this.pageSize,
        "orderBy": "",
        "orderType": "",
        "page": this.page - 1
      },
      "tuNgay": ""
    }
    if (this.formData.value.ngayTao != null) {
      body.tuNgay = this.formData.value.ngayTao[0]
      body.denNgay = this.formData.value.ngayTao[1]
    }
    let res = await this.quanLyDanhSachHangHongHocService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      this.dataTable = [...res.data.content]
      this.totalRecord = res.data.totalElements;
      this.dataTableAll = cloneDeep(this.dataTable)
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg)
    }
    console.log(this.dataTable)
  }




  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };

    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      this.dsDonViDataSource = dsTong[DANH_MUC_LEVEL.CHI_CUC].map(
        (item) => item.tenDvi,
      );
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiHangHoa = res.data;
      this.dsLoaiHangHoaDataSource = res.data?.map((item) => item.giaTri);
    }
  }

  onChangeAutoComplete(e) {
    const value = (e.target as HTMLInputElement).value;
    if (value) {
      this.dsDonViDataSource = this.dsDonVi
        .filter((item) =>
          item?.tenDvi?.toLowerCase()?.includes(value.toLowerCase()),
        )
        .map((item) => item.tenDvi);
    } else {
      this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
    }
  }

  onChangeLoaiHHAutoComplete(e) {
    const value = (e.target as HTMLInputElement).value;
    if (value) {
      this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa
        .filter((item) =>
          item?.giaTri?.toLowerCase()?.includes(value.toLowerCase()),
        )
        .map((item) => item.giaTri);
    } else {
      this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa.map(
        (item) => item.giaTri,
      );
    }
  }

  clearFilter() {
    this.formData.reset();
  }

  exportData() { }

  xoa() { }

  inDanhSach() { }

  themMoi() {
    this.isAddNew = true;
  }

  onAllChecked(checked) {
    this.dataTable.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.allChecked = this.dataTable.every(({ id }) =>
      this.setOfCheckedId.has(id),
    );
    this.indeterminate =
      this.dataTable.some(({ id }) => this.setOfCheckedId.has(id)) &&
      !this.allChecked;
  }

  onChangeFilterDate(event) { }

  changePageIndex(event) { }

  changePageSize(event) { }

  viewDetail(id: number, isUpdate: boolean) { }

  xoaItem(id: number) { }

  onItemChecked(id: number, checked) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onClose() {
    this.isAddNew = false;
  }
}

interface ITrangThai {
  id: number;
  giaTri: string;
}

interface IHangHongHocGiamChatLuong {
  id: number;
  maDanhSach: string;
  idDonVi: number;
  tenDonVi: string;
  ngayTao: Date;
  trangThai: string;
}
