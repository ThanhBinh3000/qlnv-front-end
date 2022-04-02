import { cloneDeep } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'dialog-thong-tin-phu-luc-khlcnt',
  templateUrl: './dialog-thong-tin-phu-luc-khlcnt.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-khlcnt.component.scss'],
})
export class DialogThongTinPhuLucKHLCNTComponent implements OnInit {
  data: any = null;
  dataTable: any[] = [];
  tableExist: boolean = false;
  itemRow: any = {};

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    private _modalRef: NzModalRef,
    private helperService: HelperService,
  ) { }

  ngOnInit() {
    if (!this.data) {
      this.data = {};
    }
    this.dataTable = [
      {
        id: 1,
        goiThau: 'Số 1',
        diaDiem: 'Việt trì, Phú thọ',
        soLuong: 1330,
        donGia: 13020,
        thanhTien: 17316600000,
      }
    ];
    this.updateEditCache();
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
  }

  updateEditCache(): void {
    this.dataTable.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  cancelEdit(id: string): void {
    const index = this.dataTable.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.dataTable[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.dataTable.findIndex(item => item.id === id);
    this.editCache[id].data.thanhTien = (this.editCache[id].data.soLuong ?? 0) * (this.editCache[id].data.donGia ?? 0);
    Object.assign(this.dataTable[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  addRow() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.itemRow);
    item.id = this.dataTable.length + 1;
    item.thanhTien = (item.soLuong ?? 0) * (item.donGia ?? 0);
    this.dataTable = [
      ...this.dataTable,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.itemRow = {};
  }

  deleteRow(data: any) {
    this.dataTable = this.dataTable.filter(x => x.id != data.id);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(id: number) {
    this.editCache[id].edit = true;
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.id = i + 1;
    });
  }

  reduceRowData(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): number {
    let sumVal = 0;
    const listTable = document
      .getElementById(idTable)
      ?.getElementsByTagName('table');

    if (listTable && listTable.length >= indexTable) {
      const table = listTable[indexTable];
      for (let i = indexRow; i < table.rows.length - 1; i++) {
        if (
          table.rows[i]?.cells[indexCell]?.innerHTML &&
          table.rows[i]?.cells[indexCell]?.innerHTML != ''
        ) {
          sumVal =
            sumVal +
            parseFloat(this.helperService.replaceAll(table.rows[i].cells[indexCell].innerHTML, stringReplace, ''));
        }
      }
    }
    return sumVal;
  }

  onCancel() {
    this._modalRef.close();
  }
}
