import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ke-hoach-luong-thuc',
  templateUrl: './ke-hoach-luong-thuc.component.html',
  styleUrls: ['./ke-hoach-luong-thuc.component.scss'],
})
export class KeHoachLuongThucComponent implements OnInit {
  @Input('keHoach') keHoach: any;
  @Input()
  ltGaoMua: number
  @Output()
  ltGaoMuaChange = new EventEmitter<number>();

  @Input()
  ltGaoXuat: number
  @Output()
  ltGaoXuatChange = new EventEmitter<number>();

  @Input()
  ltThocXuat: number
  @Output()
  ltThocXuatChange = new EventEmitter<number>();

  @Input()
  ltThocMua: number
  @Output()
  ltThocMuaChange = new EventEmitter<number>();

  dataTable = [];
  namHienTai: number = 2022;

  constructor() { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    console.log(this.keHoach)
  }

  onChangeInput() {
    console.log("avvv");
    this.ltThocMuaChange.emit(this.ltThocMua);
    this.ltThocXuatChange.emit(this.ltThocXuat);
    this.ltGaoXuatChange.emit(this.ltGaoXuat);
    this.ltGaoMuaChange.emit(this.ltGaoMua);
  }
}
