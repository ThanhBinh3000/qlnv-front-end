import { Component, OnInit } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-ke-hoach-xuat-ban',
  templateUrl: './ke-hoach-xuat-ban.component.html',
  styleUrls: ['./ke-hoach-xuat-ban.component.scss'],
})
export class KeHoachXuatBanComponent implements OnInit {
  dataTable = [];

  rowItem: IXuatBan = {
    id: null,
    idHangHoa: null,
    tenHangHoa: null,
    idChungLoaiHangHoa: null,
    tenChungLoaiHangHoa: null,
    idDonViTinh: null,
    donViTinh: null,
    keHoachNam: null,
  };

  dataEdit: { [key: string]: { edit: boolean; data: IXuatBan } } = {};
  dsHangHoa = [];
  dsChungLoaiHangHoa = [];
  dsDonViTinh = [];
  dsKeHoachNam = [];

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;

  constructor() {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.dsHangHoa = [
      {
        id: 1,
        tenHangHoa: 'Xuồng cao tốc',
      },
      {
        id: 2,
        tenHangHoa: 'Cano',
      },
    ];
    this.dsChungLoaiHangHoa = [
      {
        id: 1,
        tenChungLoaiHangHoa: 'Vật tư',
      },
      {
        id: 2,
        tenChungLoaiHangHoa: 'Thóc',
      },
    ];
    this.dsDonViTinh = [
      {
        id: 1,
        giaTri: 'Chiếc',
      },
      {
        id: 2,
        giaTri: 'Bộ',
      },
    ];
    this.dsKeHoachNam = [10, 15, 20];
  }

  editItem(id: number): void {
    this.dataEdit[id].edit = true;
  }

  xoaItem(id: number) {}
  themMoiItem() {}
  clearData() {}

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

  changePageIndex(event) {}

  changePageSize(event) {}
}

interface IXuatBan {
  id: number;
  idHangHoa: number;
  tenHangHoa: string;
  idChungLoaiHangHoa: number;
  tenChungLoaiHangHoa: string;
  idDonViTinh: number;
  donViTinh: string;
  keHoachNam: number;
}
