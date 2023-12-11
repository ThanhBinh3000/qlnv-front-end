import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import { AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL } from '../../../../../../../../Utility/utils';

@Component({
  selector: 'app-ke-hoach-nhap-xuat-lt',
  templateUrl: './ke-hoach-nhap-xuat-lt.component.html',
  styleUrls: ['./ke-hoach-nhap-xuat-lt.component.scss'],
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
    this.changeDataInput(null);
  }


  changeDataInput($event, type?: string, stt?: number) {
    if (type && type == 'row1' && this.keHoachNhapXuat.soLuongMuaThoc && this.keHoachNhapXuat.donGiaMuaThoc) {
      let num = 0;
      if (stt) {
        num = (stt == 1 ? ($event * this.keHoachNhapXuat.donGiaMuaThoc) : (this.keHoachNhapXuat.soLuongMuaThoc * $event));
      }
      this.keHoachNhapXuat.tienMuaThoc = num ? (num / 1000) : 0;
    }
    if (type && type == 'row2' && this.keHoachNhapXuat.soLuongMuaGao && this.keHoachNhapXuat.donGiaMuaGao) {
      if (!this.keHoachNhapXuat.nhapCtMua) {
        let num = 0;
        if (stt) {
          num = (stt == 1 ? ($event * this.keHoachNhapXuat.donGiaMuaGao) : (this.keHoachNhapXuat.soLuongMuaGao * $event));
        }
        this.keHoachNhapXuat.tongTienMuaGao = num ? (num / 1000) : 0;
      } else {
        this.keHoachNhapXuat.tongTienMuaGao = 0;
      }
    }
    if (type && type == 'row3' && this.keHoachNhapXuat.soLuongMuaGaoLpdh && this.keHoachNhapXuat.donGiaMuaGaoLpdh) {
      if (this.keHoachNhapXuat.nhapCtMua) {
        let num = 0;
        if (stt) {
          num = (stt == 1 ? ($event * this.keHoachNhapXuat.donGiaMuaGaoLpdh) : (this.keHoachNhapXuat.soLuongMuaGaoLpdh * $event));
        }
        this.keHoachNhapXuat.tienMuaGaoLpdh = num ? (num / 1000) : 0;
      } else {
        this.keHoachNhapXuat.tienMuaGaoLpdh = 0;
      }
    }
    if (type && type == 'row4' && this.keHoachNhapXuat.soLuongMuaGaoXcht && this.keHoachNhapXuat.donGiaMuaGaoXcht) {
      if (this.keHoachNhapXuat.nhapCtMua) {
        let num = 0;
        if (stt) {
          num = (stt == 1 ? ($event * this.keHoachNhapXuat.donGiaMuaGaoXcht) : (this.keHoachNhapXuat.soLuongMuaGaoXcht * $event));
        }
        this.keHoachNhapXuat.tienMuaGaoXcht = num ? (num / 1000) : 0;
      } else {
        this.keHoachNhapXuat.tienMuaGaoXcht = 0;
      }
    }
    if (type && type == 'row5' && this.keHoachNhapXuat.soLuongBan && this.keHoachNhapXuat.donGiaBan) {
      if (!this.keHoachNhapXuat.nhapCtBan) {
        let num = 0;
        if (stt) {
          num = (stt == 1 ? ($event * this.keHoachNhapXuat.donGiaBan) : (this.keHoachNhapXuat.soLuongBan * $event));
        }
        this.keHoachNhapXuat.tongTienBan = num ? (num / 1000) : 0;
      } else {
        this.keHoachNhapXuat.tongTienBan = 0;
      }
    }
    if (type && type == 'row6' && this.keHoachNhapXuat.soLuongBanThoc && this.keHoachNhapXuat.donGiaBanThoc) {
      if (this.keHoachNhapXuat.nhapCtBan) {
        let num = 0;
        if (stt) {
          num = (stt == 1 ? ($event * this.keHoachNhapXuat.donGiaBanThoc) : (this.keHoachNhapXuat.soLuongBanThoc * $event));
        }
        this.keHoachNhapXuat.tienBanThoc = num ? (num / 1000) : 0;
      } else {
        this.keHoachNhapXuat.tienBanThoc = 0;
      }
    }
    if (type && type == 'row7' && this.keHoachNhapXuat.soLuongBanGao && this.keHoachNhapXuat.donGiaBanGao) {
      if (this.keHoachNhapXuat.nhapCtBan) {
        let num = 0;
        if (stt) {
          num = (stt == 1 ? ($event * this.keHoachNhapXuat.donGiaBanGao) : (this.keHoachNhapXuat.soLuongBanGao * $event));
        }
        this.keHoachNhapXuat.tienBanGao = num ? (num / 1000) : 0;
      } else {
        this.keHoachNhapXuat.tienBanGao = 0;
      }
    }
    if (type && type == 'row8' && this.keHoachNhapXuat.soLuongGaoCtro && this.keHoachNhapXuat.donGiaGaoCtro) {
      let num = 0;
      if (stt) {
        num = (stt == 1 ? ($event * this.keHoachNhapXuat.donGiaGaoCtro) : (this.keHoachNhapXuat.soLuongGaoCtro * $event));
      }
      this.keHoachNhapXuat.tienGaoCtro = num ? (num / 1000) : 0;
    }
  }
}
