import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from '../../luu-kho.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-so-kho-the-kho',
  templateUrl: './so-kho-the-kho.component.html',
  styleUrls: ['./so-kho-the-kho.component.scss'],
})
export class SoKhoTheKhoComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  formData: FormGroup;
  isAddNew = false;
  allChecked = false;
  indeterminate = false;
  filterDate = new Date();
  dsTrangThai: ITrangThai[] = [
    // fake
    { id: 1, giaTri: 'Đang xử lý' },
    { id: 2, giaTri: 'Chờ duyệt' },
    { id: 3, giaTri: 'Đã duyệt' },
  ];
  dsTong: any;
  dsTrangThaiDataSource = [];
  dsNam: string[] = [];
  dsNamDataSource: string[] = [];
  dsDonVi = [];
  dsDonViDataSource = [];
  dsLoaiHangHoa = [];
  dsChungLoaiHangHoa = [];
  dsDiemKho = [];
  dsDiemKhoDataSource = [];
  dsNhaKho = [];
  dsNhaKhoDataSource = [];
  dsNganLo = [];
  dsNganLoDataSource = [];
  searchInTable: any = {
    nam: null,
    tuNgay: new Date(),
    denNgay: new Date(),
    loaiHangHoa: null,
    chungLoaiHangHoa: null,
    ngayTao: new Date(),
    donVi: null,
    diemKho: null,
    nhaKho: null,
    nganLo: null,
    trangThai: null,
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];

  dataExample: ISoKhoTheKho[] = [
    {
      id: 1,
      nam: 2018,
      tuNgay: new Date(),
      denNgay: new Date(),
      idLoaiHangHoa: 1,
      tenLoaiHangHoa: 'Hang hoa 1',
      idChungLoaiHangHoa: 1,
      tenChungLoaiHangHoa: 'Chung loai HH 1',
      ngayTao: new Date(),
      idDonVi: 1,
      tenDonVi: 'Đơn vị 1',
      idDiemKho: 1,
      tenDiemKho: 'Điểm kho 1',
      idNhaKho: 1,
      tenNhaKho: 'Nhà kho 1',
      idNganLo: 1,
      tenNganLo: 'Ngăn lô 1',
      trangThai: 'Đã duyệt',
    },
    {
      id: 2,
      nam: 2028,
      tuNgay: new Date(),
      denNgay: new Date(),
      idLoaiHangHoa: 2,
      tenLoaiHangHoa: 'Hang hoa 2',
      idChungLoaiHangHoa: 2,
      tenChungLoaiHangHoa: 'Chung loai HH 2',
      ngayTao: new Date(),
      idDonVi: 2,
      tenDonVi: 'Đơn vị 2',
      idDiemKho: 2,
      tenDiemKho: 'Điểm kho 2',
      idNhaKho: 2,
      tenNhaKho: 'Nhà kho 2',
      idNganLo: 2,
      tenNganLo: 'Ngăn lô 2',
      trangThai: 'Đã duyệt',
    },
    {
      id: 3,
      nam: 2038,
      tuNgay: new Date(),
      denNgay: new Date(),
      idLoaiHangHoa: 3,
      tenLoaiHangHoa: 'Hang hoa 3',
      idChungLoaiHangHoa: 3,
      tenChungLoaiHangHoa: 'Chung loai HH 3',
      ngayTao: new Date(),
      idDonVi: 3,
      tenDonVi: 'Đơn vị 3',
      idDiemKho: 3,
      tenDiemKho: 'Điểm kho 3',
      idNhaKho: 3,
      tenNhaKho: 'Nhà kho 3',
      idNganLo: 3,
      tenNganLo: 'Ngăn lô 3',
      trangThai: 'Đã duyệt',
    },
    {
      id: 4,
      nam: 2048,
      tuNgay: new Date(),
      denNgay: new Date(),
      idLoaiHangHoa: 4,
      tenLoaiHangHoa: 'Hang hoa 4',
      idChungLoaiHangHoa: 4,
      tenChungLoaiHangHoa: 'Chung loai HH 4',
      ngayTao: new Date(),
      idDonVi: 4,
      tenDonVi: 'Đơn vị 4',
      idDiemKho: 4,
      tenDiemKho: 'Điểm kho 4',
      idNhaKho: 4,
      tenNhaKho: 'Nhà kho 4',
      idNganLo: 4,
      tenNganLo: 'Ngăn lô 4',
      trangThai: 'Đã duyệt',
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly donviService: DonviService,
    private readonly spinner: NgxSpinnerService,
    private readonly notification: NzNotificationService,
    private readonly userService: UserService,
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
      nam: [2022],
      maDonVi: [null],
      tenDonVi: [null],
      loaiHangHoa: [null],
      chungLoaiHangHoa: [null],
      ngayTao: [[new Date(), new Date()]],
    });
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
    this.loadDsNam();
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
      this.dsNamDataSource = [...this.dsNam];
    }
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
      this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
      this.dsDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
      this.dsDiemKhoDataSource = this.dsDiemKho.map((item) => item.tenDvi);
      this.dsNhaKho = dsTong[DANH_MUC_LEVEL.NHA_KHO];
      this.dsNhaKhoDataSource = this.dsNhaKho.map((item) => item.tenDvi);
      this.dsNganLo = dsTong[DANH_MUC_LEVEL.NGAN_LO];
      this.dsNganLoDataSource = this.dsNganLo.map((item) => item.tenDvi);
      this.dsTrangThaiDataSource = this.dsTrangThai.map((item) => item.giaTri);
    }
  }

  onChangeAutoComplete(e, srcFieldName: string, rootFieldName: string) {
    const value = (e.target as HTMLInputElement).value;
    if (value) {
      this[srcFieldName] = this[rootFieldName]
        .filter(
          (item) =>
            item?.tenDvi?.toLowerCase()?.includes(value.toLowerCase()) ||
            item?.toLowerCase()?.includes(value.toLowerCase()) ||
            item?.giaTri?.toLowerCase()?.includes(value.toLowerCase()),
        )
        .map((item) => item.tenDvi || item.giaTri || item);
    } else {
      this[srcFieldName] = this[rootFieldName].map(
        (item) => item.tenDvi || item.giaTri || item,
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

interface ISoKhoTheKho {
  id: number;
  nam: number;
  tuNgay: Date;
  denNgay: Date;
  idLoaiHangHoa: number;
  tenLoaiHangHoa: string;
  idChungLoaiHangHoa: number;
  tenChungLoaiHangHoa: string;
  ngayTao: Date;
  idDonVi: number;
  tenDonVi: string;
  idDiemKho: number;
  tenDiemKho: string;
  idNhaKho: number;
  tenNhaKho: string;
  idNganLo: number;
  tenNganLo: string;
  trangThai: string;
}
