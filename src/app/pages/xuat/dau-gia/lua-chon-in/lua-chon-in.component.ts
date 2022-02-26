import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-lua-chon-in',
  templateUrl: './lua-chon-in.component.html',
  styleUrls: ['./lua-chon-in.component.scss'],
})
export class LuaChonInComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() closeModal = new EventEmitter();
  @Output() handleOkEvent = new EventEmitter<boolean>();
  @Output() handleCancelEvent = new EventEmitter<boolean>();
  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };
  constructor() {}

  handleOk() {
    this.handleOkEvent.emit(false);
  }
  handleCancel() {
    this.handleCancelEvent.emit(false);
  }

  ngOnInit(): void {}
}
