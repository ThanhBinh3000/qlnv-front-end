import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-thanh-phan-lay-mau',
  templateUrl: './thanh-phan-lay-mau.component.html',
  styleUrls: ['./thanh-phan-lay-mau.component.scss']
})
export class ThanhPhanLayMauComponent implements OnInit {

  @Input() loaiDaiDien: string;
  @Input() dataTable: any[] = [];
  @Output() dataTableChange = new EventEmitter<any[]>();

  constructor() { }

  itemRow: ItemDaiDien = new ItemDaiDien();

  ngOnInit(): void {
    this.emitDataTable();
  }

  addDaiDien() {
    this.itemRow.loaiDaiDien = this.loaiDaiDien;
    this.dataTable.push(this.itemRow);
    this.itemRow = new ItemDaiDien();
    this.emitDataTable();
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable)
  }

}

export class ItemDaiDien {
  id: number
  daiDien: string
  loaiDaiDien: string;
  isEdit: boolean = false;
}





