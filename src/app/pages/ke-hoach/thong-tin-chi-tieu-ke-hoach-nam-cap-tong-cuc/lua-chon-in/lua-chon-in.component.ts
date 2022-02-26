import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-lua-chon-in',
  templateUrl: './lua-chon-in.component.html',
  styleUrls: ['./lua-chon-in.component.scss'],
})
export class LuaChonInComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor() {}

  ngOnInit(): void {}

  handleOk() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
