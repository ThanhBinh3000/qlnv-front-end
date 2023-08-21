import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-xk-thanh-phan-tham-gia',
  templateUrl: './thanh-phan-tham-gia.component.html',
  styleUrls: ['./thanh-phan-tham-gia.component.scss']
})
export class ThanhPhanThamGiaComponent implements OnInit {

  @Input() loaiDaiDien: string;
  @Input() isView: boolean;
  @Input() dataTable: any[] = [];
  @Output() dataTableChange = new EventEmitter<any[]>();

  constructor(
    private modal: NzModalService
  ) { }

  itemRow: ItemDaiDien = new ItemDaiDien();
  dataEdit: { [key: string]: { edit: boolean; data: ItemDaiDien } } = {};
  hasError: boolean = false;
  ngOnInit(): void {
    this.emitDataTable();
  }

  addDaiDien() {
    let item = cloneDeep(this.itemRow);
    item.edit = false;
    this.dataTable = [
      ...this.dataTable,
      item,
    ];
    this.itemRow.loaiDaiDien = this.loaiDaiDien;
    this.itemRow = new ItemDaiDien();
    this.emitDataTable();
    this.updateEditCache()
  }


  emitDataTable() {
    this.dataTableChange.emit(this.dataTable)
  }

  clearData() {
    this.itemRow = new ItemDaiDien();
    this.dataTable = [];
  }
  editItem(index: number): void {
    if (this.dataEdit[index]) {
      this.dataEdit[index].edit = true;
    }
  }

  xoaItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  saveEdit(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }

  cancelEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

}

export class ItemDaiDien {
  id: number
  daiDien: string
  loaiDaiDien: string;
  isEdit: boolean = false;
}
