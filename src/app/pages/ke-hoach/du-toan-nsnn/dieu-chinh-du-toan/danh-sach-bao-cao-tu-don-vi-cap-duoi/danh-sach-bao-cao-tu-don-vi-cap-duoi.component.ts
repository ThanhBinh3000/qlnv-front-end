import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/Utility/utils';
import { cloneDeep } from 'lodash';
import { DatePipe } from '@angular/common';

export const TRANG_THAI_TIM_KIEM = [
  {
    id: "1",
    tenDm: 'Đang soạn'
  },
  {
    id: "2",
    tenDm: 'Trình duyệt'
  },
  {
    id: "3",
    tenDm: 'Trưởng BP từ chối'
  },
  {
    id: "4",
    tenDm: 'Trưởng BP duyệt'
  },
  {
    id: "5",
    tenDm: 'Lãnh đạo từ chối'
  },
  {
    id: "6",
    tenDm: 'Lãnh đạo duyệt'
  },
  {
    id: "7",
    tenDm: 'Mới'
  },
  {
    id: "8",
    tenDm: 'Từ chối'
  },
  {
    id: "9",
    tenDm: 'Tiếp nhận'
  },
]
@Component({
  selector: 'app-danh-sach-bao-cao-tu-don-vi-cap-duoi',
  templateUrl: './danh-sach-bao-cao-tu-don-vi-cap-duoi.component.html',
  styleUrls: ['./danh-sach-bao-cao-tu-don-vi-cap-duoi.component.scss']
})
export class DanhSachBaoCaoTuDonViCapDuoiComponent implements OnInit {

  searchFilter = {
    loaiTimKiem: '1',
    nam: null,
    tuNgay: null,
    denNgay: null,
    maBaoCao: "",
    donViTao: "",
    trangThai: "",
  };

  filterTable: any = {
    maBcao: '',
    ngayTao: '',
    namHienHanh: '',
    dotBcao: '',
    ngayTrinh: '',
    ngayDuyet: '',
    ngayPheDuyet: '',
    ngayTraKq: ''
  };

  donVis: any[] = [];

  trangThais: any[] = [];

  userRole: string;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  statusCaptren: boolean;

  // khai bao dau bao cao
  constructor(
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
  };


  clearFilter() {

  };


  search() {

  };

  // Tìm kiếm trong bảng
  filterInTable(key: string, value: string, isDate: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (isDate) {
          value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
        }
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  };

}
