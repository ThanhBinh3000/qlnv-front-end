import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-them-so-kho-the-kho',
  templateUrl: './them-so-kho-the-kho.component.html',
  styleUrls: ['./them-so-kho-the-kho.component.scss'],
})
export class ThemSoKhoTheKhoComponent implements OnInit {
  @Output('close') onClose = new EventEmitter<any>();
  formData: FormGroup;
  dataTable: INhapXuat[];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dsNam: number[] = [2019, 2020, 2021, 2022];
  dsLoaiHangHoa = [];
  dsChungLoaiHangHoa = [];
  dsNganLo = [];
  dsDonViTinh = [];

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formData = this.fb.group({
      tenDonVi: [null],
      nam: [2020],
      tuNgay: [new Date()],
      denNgay: [new Date()],
      loaiHangHoa: [null],
      chungLoaiHangHoa: [null],
      nganLo: [null],
      tonDauKy: [null],
      donViTinh: [null],
    });
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
