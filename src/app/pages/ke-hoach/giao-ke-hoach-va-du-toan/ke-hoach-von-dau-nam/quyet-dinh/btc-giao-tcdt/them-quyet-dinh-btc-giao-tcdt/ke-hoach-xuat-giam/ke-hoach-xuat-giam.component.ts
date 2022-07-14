import { Component, OnInit, Input } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-ke-hoach-xuat-giam',
  templateUrl: './ke-hoach-xuat-giam.component.html',
  styleUrls: ['./ke-hoach-xuat-giam.component.scss'],
})
export class KeHoachXuatGiamComponent implements OnInit {
  @Input('quyetDinh') quyetDinh: any;
  dataTable = [];

  rowItem: IXuatGiam = {
    id: null,
    idLoaiHangHoa: null,
    tenLoaiHangHoa: null,
    idHangHoa: null,
    tenHangHoa: null,
    idDonViTinh: null,
    donViTinh: null,
    soLuong: null,
    duToan: null,
  };
  dsLoaiHangHoa = [];
  dsHangHoa = [];
  dsDonViTinh = [];
  dataEdit: { [key: string]: { edit: boolean; data: IXuatGiam } } = {};
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  allChecked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  constructor() {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.dataTable = [
      {
        id: 1,
        idLoaiHangHoa: 1,
        tenLoaiHangHoa: 'Thóc',
        idHangHoa: 1,
        tenHangHoa: 'Thóc tẻ',
        idDonViTinh: 1,
        donViTinh: 'Chiếc',
        soLuong: 100,
        duToan: 250,
      },
      {
        id: 2,
        idLoaiHangHoa: 2,
        tenLoaiHangHoa: 'Thóc',
        idHangHoa: 2,
        tenHangHoa: 'Thóc tẻ',
        idDonViTinh: 2,
        donViTinh: 'Chiếc',
        soLuong: 100,
        duToan: 250,
      },
    ];

    this.dsLoaiHangHoa = [
      {
        id: 1,
        giaTri: 'Thóc',
      },
      {
        id: 2,
        giaTri: 'Muối',
      },
    ];
    this.dsHangHoa = [
      {
        id: 1,
        giaTri: 'Thóc tẻ',
      },
      {
        id: 2,
        giaTri: 'Muối i-ốt',
      },
    ];

    this.dsDonViTinh = [
      {
        id: 1,
        giaTri: 'Chiếc',
      },
      {
        id: 2,
        giaTri: 'Tấn',
      },
    ];

    this.updateEditCache();
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

  calcTong() {
    const sum = this.dataTable.reduce((prev, cur) => {
      prev += cur.duToan;
      return prev;
    }, 0);
    return sum;
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
}

interface IXuatGiam {
  id: number;
  idLoaiHangHoa: number;
  tenLoaiHangHoa: string;
  idHangHoa: number;
  tenHangHoa: string;
  idDonViTinh: number;
  donViTinh: string;
  soLuong: number;
  duToan: number;
}
