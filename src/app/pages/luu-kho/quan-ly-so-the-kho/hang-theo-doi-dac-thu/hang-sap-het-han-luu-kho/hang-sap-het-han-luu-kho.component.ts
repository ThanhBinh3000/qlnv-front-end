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

@Component({
  selector: 'app-hang-sap-het-han-luu-kho',
  templateUrl: './hang-sap-het-han-luu-kho.component.html',
  styleUrls: ['./hang-sap-het-han-luu-kho.component.scss'],
})
export class HangSapHetHanLuuKhoComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  formData: FormGroup;
  filterDate = new Date();
  dsTrangThai: ITrangThai[] = [
    // fake
    { id: 1, giaTri: 'Đang xử lý' },
    { id: 2, giaTri: 'Chờ duyệt' },
    { id: 3, giaTri: 'Đã duyệt' },
  ];
  dsTong: any;
  dsDonVi = [];
  dsDonViDataSource = [];
  dsLoaiHangHoa = [];
  dsLoaiHangHoaDataSource = [];
  dsDiemKho = [];
  dsDiemKhoDataSource = [];
  dsNhaKho = [];
  dsNhaKhoDataSource = [];
  dsNganLo = [];
  dsNganLoDataSource = [];
  searchInTable: any = {
    idDonVi: null,
    idLoaiHangHoa: null,
    tenHangHoa: null,
    idDiemKho: null,
    idNhaKho: null,
    idNganLo: null,
    ngayNhapKho: new Date(),
  };

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataTable: any[] = [];

  dataExample: IHangSapHetHanLuuKho[] = [
    {
      id: 1,
      idDonVi: 1,
      tenDonVi: 'Dơn vị 1',
      idLoaiHangHoa: 1,
      tenLoaiHangHoa: 'Loại hàng hoá 1',
      idHangHoa: 1,
      tenHangHoa: 'Tên hàng hoá 1',
      idDiemKho: 1,
      tenDiemKho: 'Tên điểm kho 1',
      idNhaKho: 1,
      tenNhaKho: 'Tên nhà kho 1',
      idNganLo: 1,
      tenNganLo: 'Tên ngăn lô 1',
      ngayNhap: new Date(),
      ngayHetHanBaoHanh: new Date(),
      soLuong: 1000,
      donVi: 'Chiếc',
    },
    {
      id: 2,
      idDonVi: 2,
      tenDonVi: 'Dơn vị 2',
      idLoaiHangHoa: 2,
      tenLoaiHangHoa: 'Loại hàng hoá 2',
      idHangHoa: 2,
      tenHangHoa: 'Tên hàng hoá 2',
      idDiemKho: 2,
      tenDiemKho: 'Tên điểm kho 2',
      idNhaKho: 2,
      tenNhaKho: 'Tên nhà kho 2',
      idNganLo: 2,
      tenNganLo: 'Tên ngăn lô 2',
      ngayNhap: new Date(),
      ngayHetHanBaoHanh: new Date(),
      soLuong: 1000,
      donVi: 'Chiếc',
    },
    {
      id: 3,
      idDonVi: 3,
      tenDonVi: 'Dơn vị 3',
      idLoaiHangHoa: 3,
      tenLoaiHangHoa: 'Loại hàng hoá 3',
      idHangHoa: 3,
      tenHangHoa: 'Tên hàng hoá 3',
      idDiemKho: 3,
      tenDiemKho: 'Tên điểm kho 3',
      idNhaKho: 3,
      tenNhaKho: 'Tên nhà kho 3',
      idNganLo: 3,
      tenNganLo: 'Tên ngăn lô 3',
      ngayNhap: new Date(),
      ngayHetHanBaoHanh: new Date(),
      soLuong: 1000,
      donVi: 'Chiếc',
    },
    {
      id: 4,
      idDonVi: 4,
      tenDonVi: 'Dơn vị 4',
      idLoaiHangHoa: 4,
      tenLoaiHangHoa: 'Loại hàng hoá 4',
      idHangHoa: 4,
      tenHangHoa: 'Tên hàng hoá 4',
      idDiemKho: 4,
      tenDiemKho: 'Tên điểm kho 4',
      idNhaKho: 4,
      tenNhaKho: 'Tên nhà kho 4',
      idNganLo: 4,
      tenNganLo: 'Tên ngăn lô 4',
      ngayNhap: new Date(),
      ngayHetHanBaoHanh: new Date(),
      soLuong: 1000,
      donVi: 'Chiếc',
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly donviService: DonviService,
    private readonly spinner: NgxSpinnerService,
    private readonly notification: NzNotificationService,
    private readonly userService: UserService,
    private readonly danhMucService: DanhMucService,
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
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };

    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
      // this.dsDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
      // this.dsDiemKhoDataSource = this.dsDiemKho.map((item) => item.tenDvi);
      // this.dsNhaKho = dsTong[DANH_MUC_LEVEL.NHA_KHO];
      // this.dsNhaKhoDataSource = this.dsNhaKho.map((item) => item.tenDvi);
      // this.dsNganLo = dsTong[DANH_MUC_LEVEL.NGAN_LO];
      // this.dsNganLoDataSource = this.dsNganLo.map((item) => item.tenDvi);
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

  onChangeAutoCompleteLoaiHH(e) {
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

  onChangeDonVi(id) {
    const chiCuc = this.dsDonVi.find((item) => item.id === Number(id));
    if (chiCuc) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, chiCuc),
      };
      this.dsDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
    } else {
      this.dsDiemKho = [];
    }
  }

  onChangeDiemKho(id) {
    const diemKho = this.dsDiemKho.find((item) => item.id === Number(id));
    if (diemKho) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, diemKho),
      };
      this.dsNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
    } else {
      this.dsNhaKho = [];
    }
  }

  onChangeNhaKho(id) {
    const nhaKho = this.dsNhaKho.find((item) => item.id === Number(id));
    if (nhaKho) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, nhaKho),
      };
      this.dsNganLo = result[DANH_MUC_LEVEL.NGAN_LO];
    } else {
      this.dsNganLo = [];
    }
  }

  onChangeFilterDate(event) {}

  changePageIndex(event) {}

  changePageSize(event) {}
}

interface ITrangThai {
  id: number;
  giaTri: string;
}

interface IHangSapHetHanLuuKho {
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
