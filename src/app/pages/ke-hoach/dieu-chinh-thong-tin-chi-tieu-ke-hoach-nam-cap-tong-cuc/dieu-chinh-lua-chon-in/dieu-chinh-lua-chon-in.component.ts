import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dieu-chinh-lua-chon-in',
  templateUrl: './dieu-chinh-lua-chon-in.component.html',
  styleUrls: ['./dieu-chinh-lua-chon-in.component.scss'],
})
export class DieuChinhLuaChonInComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor() { }

  ngOnInit(): void { }

  handleOk() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
