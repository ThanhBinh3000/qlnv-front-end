import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-thanhphan-laymau',
  templateUrl: './thanhphan-laymau.component.html',
  styleUrls: ['./thanhphan-laymau.component.scss']
})
export class ThanhphanLaymauComponent implements OnInit {

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
