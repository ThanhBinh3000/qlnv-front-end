import { Component, OnInit, Input } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-ke-hoach-mua-tang',
  templateUrl: './ke-hoach-mua-tang.component.html',
  styleUrls: ['./ke-hoach-mua-tang.component.scss'],
})
export class KeHoachMuaTangComponent implements OnInit {
  @Input('data') dataTable: any[] = [];

  rowItem: IMuaTang = {
    id: null,
    idNoiDung: null,
    noiDung: null,
    duToan: null,
  };
  dsNoiDung = [];
  dataEdit: { [key: string]: { edit: boolean; data: IMuaTang } } = {};
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;

  constructor() { }

  ngOnInit(): void {
    // this.initData();
    console.log(this.dataTable)
  }

  initData() {
    this.dataTable = [
      {
        id: 1,
        idNoiDung: 1,
        noiDung: 'Chi thường xuyên',
        duToan: 250,
      },
      {
        id: 2,
        idNoiDung: 2,
        noiDung: 'Khác',
        duToan: 350,
      },
    ];

    this.dsNoiDung = [
      {
        id: 1,
        noiDung: 'Chi thường xuyên',
      },
      {
        id: 2,
        noiDung: 'Khác',
      },
    ];

    this.updateEditCache();
  }

  editItem(id: number): void {
    this.dataEdit[id].edit = true;
  }

  xoaItem(id: number) { }
  themMoiItem() { }
  clearData() { }

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

  changePageIndex(event) { }

  changePageSize(event) { }

  calcTong() {
    const sum = this.dataTable.reduce((prev, cur) => {
      prev += cur.duToan;
      return prev;
    }, 0);
    return sum;
  }
}

interface IMuaTang {
  id: number;
  idNoiDung: number;
  noiDung: string;
  duToan: number;
}
