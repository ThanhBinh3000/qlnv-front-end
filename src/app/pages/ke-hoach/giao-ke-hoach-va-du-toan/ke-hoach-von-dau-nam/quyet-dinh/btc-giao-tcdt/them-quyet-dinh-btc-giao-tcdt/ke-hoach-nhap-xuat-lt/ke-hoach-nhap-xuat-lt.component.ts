import { Component, DoCheck, EventEmitter, Input, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-ke-hoach-nhap-xuat-lt',
  templateUrl: './ke-hoach-nhap-xuat-lt.component.html',
  styleUrls: ['./ke-hoach-nhap-xuat-lt.component.scss']
})
export class KeHoachNhapXuatLtComponent implements OnInit {

  @Input()
  keHoachNhapXuat: any;
  @Output()
  keHoachNhapXuatChange = new EventEmitter<any>();
  @Input()
  isView: boolean = false;

  constructor(
    public globals: Globals,
  ) {
  }

  emitData() {
    this.keHoachNhapXuatChange.emit(this.keHoachNhapXuat);
  }

  ngOnInit(): void {

  }

}
