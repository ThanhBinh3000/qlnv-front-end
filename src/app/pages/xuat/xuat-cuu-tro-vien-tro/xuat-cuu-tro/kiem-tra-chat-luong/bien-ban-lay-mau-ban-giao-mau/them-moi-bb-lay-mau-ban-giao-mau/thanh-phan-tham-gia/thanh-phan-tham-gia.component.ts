import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-thanh-phan-tham-gia',
  templateUrl: './thanh-phan-tham-gia.component.html',
  styleUrls: ['./thanh-phan-tham-gia.component.scss']
})
export class ThanhPhanThamGiaComponent implements OnInit {

  @Input() loaiDaiDien: string;
  @Input() isView: boolean;
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
