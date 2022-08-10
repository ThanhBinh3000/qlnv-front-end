import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';

@Component({
  selector: 'app-them-hang-thuoc-dien-tieu-huy',
  templateUrl: './them-hang-thuoc-dien-tieu-huy.component.html',
  styleUrls: ['./them-hang-thuoc-dien-tieu-huy.component.scss'],
})
export class ThemHangThuocDienTieuHuyComponent implements OnInit {
  @Input('dsTong') dsTong;
  @Input('dsLoaiHangHoa') dsLoaiHangHoa: any[];
  formData: FormGroup;
  dataTable: IHangTieuHuy[];
  rowItem: IHangTieuHuy = {
    id: null,
    idLoaiHangHoa: null,
    loaiHangHoa: null,
    idHangHoa: null,
    tenHangHoa: null,
    idDiemKho: null,
    tenDiemKho: null,
    idNhaKho: null,
    tenNhaKho: null,
    idNganLo: null,
    tenNganLo: null,
    soLuongTon: null,
    soLuongThanhLy: null,
    donVi: null,
    lyDo: null,
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataEdit: { [key: string]: { edit: boolean; data: IHangTieuHuy } } = {};
  dsDonVi = [];
  dsDonViDataSource = [];
  dsDiemKho = [];
  dsDiemKhoDataSource = [];
  dsNhaKho = [];
  dsNhaKhoDataSource = [];
  dsNganLo = [];
  dsNganLoDataSource = [];
  @Output('close') onClose = new EventEmitter<any>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly donviService: DonviService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  initForm(): void {
    this.formData = this.fb.group({
      idDonVi: [null],
      tenDonVi: [null],
      idDanhSach: [null],
      ngayTao: [new Date()],
    });
  }

  initData() {
    this.loadDsTong();
  }

  loadDsTong() {
    if (!isEmpty(this.dsTong)) {
      this.dsDonVi = this.dsTong[DANH_MUC_LEVEL.CHI_CUC];
      this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
      // this.dsDiemKho = this.dsTong[DANH_MUC_LEVEL.DIEM_KHO];
      // this.dsDiemKhoDataSource = this.dsDiemKho.map((item) => item.tenDvi);
      // this.dsNhaKho = this.dsTong[DANH_MUC_LEVEL.NHA_KHO];
      // this.dsNhaKhoDataSource = this.dsNhaKho.map((item) => item.tenDvi);
      // this.dsNganLo = this.dsTong[DANH_MUC_LEVEL.NGAN_LO];
      // this.dsNganLoDataSource = this.dsNganLo.map((item) => item.tenDvi);
    }
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

  huy() {
    this.onClose.emit();
  }

  exportData() {}

  inDanhSach() {}

  luu() {}

  xoaItem(id: number) {}

  themMoiItem() {}

  clearData() {}

  changePageIndex(event) {}

  changePageSize(event) {}

  editItem(id: number): void {
    this.dataEdit[id].edit = true;
  }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id === id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

  luuEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id === id);
    Object.assign(this.dataTable[index], this.dataEdit[id].data);
    this.dataEdit[id].edit = false;
  }

  updateEditCache(): void {
    this.dataTable.forEach((item) => {
      this.dataEdit[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }
}

interface IDanhSachHangTieuHuy {
  id: number;
  maDanhSach: string;
  idDonVi: number;
  tenDonVi: string;
  ngayTao: Date;
  trangThai: string;
  danhSachHang: IHangTieuHuy[];
}

interface IHangTieuHuy {
  id: number;
  idLoaiHangHoa: number;
  loaiHangHoa: string;
  idHangHoa: number;
  tenHangHoa: string;
  idDiemKho: number;
  tenDiemKho: string;
  idNhaKho: number;
  tenNhaKho: string;
  idNganLo: number;
  tenNganLo: string;
  soLuongTon: number;
  soLuongThanhLy: number;
  donVi: string;
  lyDo: string;
}
