import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-ttcp',
  templateUrl: './ttcp.component.html',
  styleUrls: ['./ttcp.component.scss'],
})
export class TtcpComponent implements OnInit {
  isAddNew = false;
  formData: FormGroup;
  toDay = new Date();
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  allChecked = false;
  indeterminate = false;

  dsNam: string[] = [];
  searchInTable: any = {
    soQd: null,
    namQd: null,
    ngayQd: new Date(),
    trichYeu: null,
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataExample: IQuyetDinhTTCP[] = [
    {
      id: 1,
      soQd: '1',
      namQd: '2011',
      ngayQd: new Date(),
      trichYeu: 'Đây là trích yếu',
      taiLieuDinhKem: 'Không có',
      trangThai: 'Dự thảo',
    },
    {
      id: 2,
      soQd: '2',
      namQd: '2012',
      ngayQd: new Date(),
      trichYeu: 'Đây là trích yếu',
      taiLieuDinhKem: 'Không có',
      trangThai: 'Dự thảo',
    },
    {
      id: 3,
      soQd: '4',
      namQd: '2011',
      ngayQd: new Date(),
      trichYeu: 'Đây là trích yếu',
      taiLieuDinhKem: 'Không có',
      trangThai: 'Dự thảo',
    },
    {
      id: 1,
      soQd: '1',
      namQd: '2011',
      ngayQd: new Date(),
      trichYeu: 'Đây là trích yếu',
      taiLieuDinhKem: 'Không có',
      trangThai: 'Dự thảo',
    },
    {
      id: 1,
      soQd: '1',
      namQd: '2011',
      ngayQd: new Date(),
      trichYeu: 'Đây là trích yếu',
      taiLieuDinhKem: 'Không có',
      trangThai: 'Dự thảo',
    },
    {
      id: 1,
      soQd: '1',
      namQd: '2011',
      ngayQd: new Date(),
      trichYeu: 'Đây là trích yếu',
      taiLieuDinhKem: 'Không có',
      trangThai: 'Dự thảo',
    },
    {
      id: 1,
      soQd: '1',
      namQd: '2011',
      ngayQd: new Date(),
      trichYeu: 'Đây là trích yếu',
      taiLieuDinhKem: 'Không có',
      trangThai: 'Dự thảo',
    },
    {
      id: 1,
      soQd: '1',
      namQd: '2011',
      ngayQd: new Date(),
      trichYeu: 'Đây là trích yếu',
      taiLieuDinhKem: 'Không có',
      trangThai: 'Dự thảo',
    },
  ];

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.initData();
    this.dataTable = [...this.dataExample];
  }

  initForm(): void {
    this.formData = this.fb.group({
      namQd: [null],
      soQd: [null],
      ngayQd: [this.last30Day, this.toDay],
      trichYeu: [null],
    });
  }

  initData() {
    this.loadDsNam();
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
    }
  }

  clearFilter() {
    this.formData.reset();
  }

  search() {

  }

  xoa() { }

  exportData() { }

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

  onItemChecked(id: number, checked) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onClose() {
    this.isAddNew = false;
  }

  changePageIndex(event) { }

  changePageSize(event) { }

  viewDetail(id: number, isViewDetail: boolean) { }

  xoaItem(id: number) { }
}

interface IQuyetDinhTTCP {
  id: number;
  soQd: string;
  namQd: string;
  ngayQd: Date;
  trichYeu: string;
  taiLieuDinhKem: any;
  trangThai: string;
}
