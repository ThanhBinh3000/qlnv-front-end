import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from '../../../luu-kho.constant';
import { DonviService } from 'src/app/services/donvi.service';

@Component({
  selector: 'app-them-so-kho-the-kho',
  templateUrl: './them-so-kho-the-kho.component.html',
  styleUrls: ['./them-so-kho-the-kho.component.scss'],
})
export class ThemSoKhoTheKhoComponent implements OnInit {
  @Input('dsTong') dsTong: any;
  @Input('dsLoaiHangHoa') dsLoaiHangHoa: any[];
  @Input('dsChungLoaiHangHoa') dsChungLoaiHangHoa: any[];
  @Output('close') onClose = new EventEmitter<any>();
  formData: FormGroup;
  dataTable: INhapXuat[];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dsNam: string[] = [];
  dsNganLo = [];
  dsDonVi = [];
  dsDonViTinh = [];
  idDonViSelected = null;

  constructor(
    private readonly fb: FormBuilder,

    private readonly donviService: DonviService,
  ) {}

  ngOnInit(): void {
    this.initData();
    this.initForm();
  }

  initForm() {
    this.formData = this.fb.group({
      idDonVi: [null],
      nam: [2020],
      tuNgay: [new Date()],
      denNgay: [new Date()],
      idLoaiHangHoa: [null],
      idChungLoaiHangHoa: [null],
      idNganLo: [null],
      tonDauKy: [null],
      donViTinh: [null],
    });
  }

  initData() {
    this.loadDsTong();
    this.loadDsNam();
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
    }
  }

  loadDsTong() {
    if (!isEmpty(this.dsTong)) {
      this.dsDonVi = this.dsTong[DANH_MUC_LEVEL.CHI_CUC];
    }
  }

  onChangeDonVi(id: string) {
    const donVi = this.dsDonVi.find((item) => item.id === Number(id));
    if (donVi) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, donVi),
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

  luuVaDuyet() {}

  luu() {}

  taoTheKho() {}

  changePageIndex(event) {}

  changePageSize(event) {}
}

interface ITheKho {
  id: number;
  idDonVi: number;
  tenDonVi: string;
  nam: number;
  tuNgay: Date;
  denNgay: Date;
  idLoaiHangHoa: number;
  tenLoaiHangHoa: string;
  idChungLoaiHangHoa: number;
  tenChungLoaiHangHoa: string;
  idNganLo: number;
  tenNganLo: string;
  soLuongTonDauKy: number;
  donViTinh: string;
}

interface INhapXuat {
  soPhieu: string;
  type: 'nhap' | 'xuat';
  ngayTao: Date;
  dienGiai: string;
  soLuong: number;
  soLuongTon: number;
  ghiChu: string;
}
