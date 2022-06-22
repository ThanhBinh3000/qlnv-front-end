import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-hang-sap-het-han-bao-hanh',
  templateUrl: './hang-sap-het-han-bao-hanh.component.html',
  styleUrls: ['./hang-sap-het-han-bao-hanh.component.scss'],
})
export class HangSapHetHanBaoHanhComponent implements OnInit {
  formData: FormGroup;
  filterDate = new Date();
  dsTrangThai: ITrangThai[] = [
    // fake
    { id: 1, giaTri: 'Đang xử lý' },
    { id: 2, giaTri: 'Chờ duyệt' },
    { id: 3, giaTri: 'Đã duyệt' },
  ];

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataTable: any[] = [];

  dataExample: IHangSapHetHanBaoHanh[] = [
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

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.dataTable = [...this.dataExample];
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

  onChangeFilterDate(event) { }

  changePageIndex(event) { }

  changePageSize(event) { }
}

interface ITrangThai {
  id: number;
  giaTri: string;
}

interface IHangSapHetHanBaoHanh {
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
