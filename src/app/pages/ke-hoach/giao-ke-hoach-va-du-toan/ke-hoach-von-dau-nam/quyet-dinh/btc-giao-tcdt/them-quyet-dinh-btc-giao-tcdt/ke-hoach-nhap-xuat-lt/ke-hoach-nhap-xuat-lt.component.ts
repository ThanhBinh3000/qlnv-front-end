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


  changeDataInput(type?: string) {
    if (type && type == 'row1' && this.keHoachNhapXuat.soLuongMuaThoc && this.keHoachNhapXuat.donGiaMuaThoc) {
      this.keHoachNhapXuat.tienMuaThoc = (this.keHoachNhapXuat.soLuongMuaThoc * this.keHoachNhapXuat.donGiaMuaThoc) / 1000;
    }
    if (type && type == 'row2' && this.keHoachNhapXuat.soLuongMuaGao && this.keHoachNhapXuat.donGiaMuaGao) {
      if (!this.keHoachNhapXuat.nhapCtMua) {
        this.keHoachNhapXuat.tongTienMuaGao = (this.keHoachNhapXuat.soLuongMuaGao * this.keHoachNhapXuat.donGiaMuaGao) / 1000;
      } else {
        this.keHoachNhapXuat.tongTienMuaGao = 0;
      }
    }
    if (type && type == 'row3' && this.keHoachNhapXuat.soLuongMuaGaoLpdh && this.keHoachNhapXuat.donGiaMuaGaoLpdh) {
      if (this.keHoachNhapXuat.nhapCtMua) {
        this.keHoachNhapXuat.tienMuaGaoLpdh = (this.keHoachNhapXuat.soLuongMuaGaoLpdh * this.keHoachNhapXuat.donGiaMuaGaoLpdh) / 1000;
      } else {
        this.keHoachNhapXuat.tienMuaGaoLpdh = 0;
      }
    }
    if (type && type == 'row4' && this.keHoachNhapXuat.soLuongMuaGaoXcht && this.keHoachNhapXuat.donGiaMuaGaoXcht) {
      if (this.keHoachNhapXuat.nhapCtMua) {
        this.keHoachNhapXuat.tienMuaGaoXcht = (this.keHoachNhapXuat.soLuongMuaGaoXcht * this.keHoachNhapXuat.donGiaMuaGaoXcht) / 1000;
      } else {
        this.keHoachNhapXuat.tienMuaGaoXcht = 0;
      }
    }
    if (type && type == 'row5' && this.keHoachNhapXuat.soLuongBan && this.keHoachNhapXuat.donGiaBan) {
      if (!this.keHoachNhapXuat.nhapCtBan) {
        this.keHoachNhapXuat.tongTienBan = (this.keHoachNhapXuat.soLuongBan * this.keHoachNhapXuat.donGiaBan) / 1000;
      } else {
        this.keHoachNhapXuat.tongTienBan = 0;
      }
    }
    if (type && type == 'row6' && this.keHoachNhapXuat.soLuongBanThoc && this.keHoachNhapXuat.donGiaBanThoc) {
      if (this.keHoachNhapXuat.nhapCtBan) {
        this.keHoachNhapXuat.tienBanThoc = (this.keHoachNhapXuat.soLuongBanThoc * this.keHoachNhapXuat.donGiaBanThoc) / 1000;
      } else {
        this.keHoachNhapXuat.tienBanThoc = 0;
      }
    }
    if (type && type == 'row7' && this.keHoachNhapXuat.soLuongBanGao && this.keHoachNhapXuat.donGiaBanGao) {
      if (this.keHoachNhapXuat.nhapCtBan) {
        this.keHoachNhapXuat.tienBanGao = (this.keHoachNhapXuat.soLuongBanGao * this.keHoachNhapXuat.donGiaBanGao) / 1000;
      } else {
        this.keHoachNhapXuat.tienBanGao = 0;
      }
    }
    if (type && type == 'row8' && this.keHoachNhapXuat.soLuongGaoCtro && this.keHoachNhapXuat.donGiaGaoCtro) {
      this.keHoachNhapXuat.tienGaoCtro = (this.keHoachNhapXuat.soLuongGaoCtro * this.keHoachNhapXuat.donGiaGaoCtro) / 1000;
    }
  }
}
