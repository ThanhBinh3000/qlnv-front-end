import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'app-ke-hoach-mua-tang',
  templateUrl: './ke-hoach-mua-tang.component.html',
  styleUrls: ['./ke-hoach-mua-tang.component.scss'],
})
export class KeHoachMuaTangComponent implements OnInit {
  @Input()
  dataTable = [];
  @Output()
  dataTableChange = new EventEmitter<any[]>();

  rowItem: IMuaTang = {
    id: null,
    idNoiDung: null,
    noiDung: null,
    duToan: null,
  };
  dsNoiDung = [];
  dataEdit: { [key: string]: { edit: boolean; data: IMuaTang } } = {};

  constructor() { }

  ngOnInit(): void {
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
    this.emitDataTable();
    this.updateEditCache();
  }

  initData() {

  }

  editItem(id: number): void {
    this.dataEdit[id].edit = true;
  }

  xoaItem(id: number) { }

  themMoiItem() {
    this.dataTable = [...this.dataTable, this.rowItem]
    this.emitDataTable();
    this.updateEditCache();
  }

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
    if (this.dataTable) {
      this.dataTable.forEach((item) => {
        this.dataEdit[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  emitDataTable() {
    console.log(this.dataTable);
    this.dataTableChange.emit(this.dataTable);
  }

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
