import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Globals} from 'src/app/shared/globals';
import {AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL} from "../../../../../../../../Utility/utils";

@Component({
  selector: 'app-ke-hoach-nhap-xuat-lt',
  templateUrl: './ke-hoach-nhap-xuat-lt.component.html',
  styleUrls: ['./ke-hoach-nhap-xuat-lt.component.scss']
})
export class KeHoachNhapXuatLtComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.keHoachNhapXuatChange.emit(this.keHoachNhapXuat);
  }

  @Input()
  keHoachNhapXuat: any;
  @Output()
  keHoachNhapXuatChange = new EventEmitter<any>();
  @Input()
  isView: boolean = false;
  amount = AMOUNT_ONE_DECIMAL;
  amount_no_decimal = AMOUNT_NO_DECIMAL;

  constructor(
    public globals: Globals,
  ) {
  }

  emitData() {
    this.keHoachNhapXuatChange.emit(this.keHoachNhapXuat);
  }

  ngOnInit(): void {
    this.changeDataInput();
  }


  changeDataInput() {
    this.keHoachNhapXuat.tienMuaThoc =  this.keHoachNhapXuat.soLuongMuaThoc * this.keHoachNhapXuat.donGiaMuaThoc;
  }
}
