import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-hang-hong-can-bao-hanh',
  templateUrl: './hang-hong-can-bao-hanh.component.html',
  styleUrls: ['./hang-hong-can-bao-hanh.component.scss'],
})
export class HangHongCanBaoHanhComponent implements OnInit {
  formData: FormGroup;
  allChecked = false;
  indeterminate = false;
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
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];

  dataExample: IHangHongCanBaoHanh[] = [
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

  constructor(private readonly fb: FormBuilder) {}

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

  exportData() {}

  xoa() {}

  inDanhSach() {}

  themMoi() {}

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
}

interface ITrangThai {
  id: number;
  giaTri: string;
}

interface IHangHongCanBaoHanh {
  id: number;
  maDanhSach: string;
  idDonVi: number;
  tenDonVi: string;
  ngayTao: Date;
  trangThai: string;
}
