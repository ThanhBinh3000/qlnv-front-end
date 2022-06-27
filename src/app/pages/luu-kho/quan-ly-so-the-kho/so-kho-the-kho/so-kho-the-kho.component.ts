import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-so-kho-the-kho',
  templateUrl: './so-kho-the-kho.component.html',
  styleUrls: ['./so-kho-the-kho.component.scss'],
})
export class SoKhoTheKhoComponent implements OnInit {
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

  dsNam: number[] = [2019, 2020, 2021, 2022];

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

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.dataTable = [...this.dataExample];
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
