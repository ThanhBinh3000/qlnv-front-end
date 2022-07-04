import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { isEmpty } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
import { DANH_MUC_LEVEL } from '../../../luu-kho.constant';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MESSAGE } from 'src/app/constants/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-hang-thuoc-dien-thanh-ly',
  templateUrl: './hang-thuoc-dien-thanh-ly.component.html',
  styleUrls: ['./hang-thuoc-dien-thanh-ly.component.scss'],
})
export class HangThuocDienThanhLyComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  formData: FormGroup;
  allChecked = false;
  indeterminate = false;
  dsTrangThai: ITrangThai[] = [
    // fake
    { id: 1, giaTri: 'Đang xử lý' },
    { id: 2, giaTri: 'Chờ duyệt' },
    { id: 3, giaTri: 'Đã duyệt' },
  ];
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
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];

  dataExample: IHangThanhLy[] = [
    {
      id: 1,
      maDanhSach: 'DS1',
      idDonVi: 1,
      tenDonVi: 'Test 1',
      ngayTao: new Date(),
      trangThai: 'Chờ duyệt',
    },
    {
      id: 2,
      maDanhSach: 'DS2',
      idDonVi: 1,
      tenDonVi: 'Test 2',
      ngayTao: new Date(),
      trangThai: 'Chờ duyệt',
    },
    {
      id: 3,
      maDanhSach: 'DS3',
      idDonVi: 3,
      tenDonVi: 'Test 3',
      ngayTao: new Date(),
      trangThai: 'Chờ duyệt',
    },
    {
      id: 4,
      maDanhSach: 'DS4',
      idDonVi: 4,
      tenDonVi: 'Test 1',
      ngayTao: new Date(),
      trangThai: 'Chờ duyệt',
    },
  ];
  isAddNew = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly donviService: DonviService,
    private readonly danhMucService: DanhMucService,
    private readonly spinner: NgxSpinnerService,
    private readonly notification: NzNotificationService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      await this.initData();
      this.dataTable = [...this.dataExample];
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      idDonVi: [null],
      tenDonVi: [null],
      tenHangHoa: [null],
      loaiHangHoa: [null],
      ngayTao: [null],
    });
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await Promise.all([this.loadDsTong(), this.loaiVTHHGetAll()]);
  }

  async loadDsTong() {
    const body = {
      maDvi: this.detail.maDvi,
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

  exportData() {}

  xoa() {}

  inDanhSach() {}

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

  clearFilter() {
    this.formData.reset();
  }

  onChangeFilterDate(event) {}

  changePageIndex(event) {}

  changePageSize(event) {}

  viewDetail(id: number, isUpdate: boolean) {}

  xoaItem(id: number) {}

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

interface IHangThanhLy {
  id: number;
  maDanhSach: string;
  idDonVi: number;
  tenDonVi: string;
  ngayTao: Date;
  trangThai: string;
}
