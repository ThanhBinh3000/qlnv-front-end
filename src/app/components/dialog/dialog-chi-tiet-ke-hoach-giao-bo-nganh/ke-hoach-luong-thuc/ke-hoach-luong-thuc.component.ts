import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { QuanLyHangTrongKhoService } from '../../../../services/quanLyHangTrongKho.service';
import { MESSAGE } from '../../../../constants/message';
import { Globals } from './../../../../shared/globals';
import { AMOUNT_ONE_DECIMAL } from '../../../../Utility/utils';

@Component({
  selector: 'app-ke-hoach-luong-thuc',
  templateUrl: './ke-hoach-luong-thuc.component.html',
  styleUrls: ['./ke-hoach-luong-thuc.component.scss'],
})
export class KeHoachLuongThucComponent implements OnInit, OnChanges {
  @Input() keHoach: any = {};
  @Output() keHoachChange = new EventEmitter<number>();
  @Input()
  ltGaoMua: number = 0;
  @Output()
  ltGaoMuaChange = new EventEmitter<number>();

  @Input()
  ltGaoXuat: number = 0;
  @Output()
  ltGaoXuatChange = new EventEmitter<number>();

  @Input()
  ltThocXuat: number = 0;
  @Output()
  ltThocXuatChange = new EventEmitter<number>();

  @Input()
  ltThocMua: number = 0;
  @Output()
  ltThocMuaChange = new EventEmitter<number>();

  @Input()
  ltThocTon: number = 0;
  @Output()
  ltThocTonChange = new EventEmitter<number>();

  @Input()
  ltGaoTon: number = 0;
  @Output()
  ltGaoTonChange = new EventEmitter<number>();

  @Input()
  ghiChu: string;
  @Output()
  ghiChuChange = new EventEmitter<string>();

  @Input()
  isView: boolean = false;

  dataTable = [];
  @Input() namHienTai: number;
  @Input() maBoNganh: string;
  ltThocDuTru: number = 0;
  ltGaoDuTru: number = 0;
  amount = AMOUNT_ONE_DECIMAL;

  constructor(private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
              public globals: Globals) {
  }

  ngOnInit(): void {
    //this.initData();
  }

  initData() {
    // this.quanLyHangTrongKhoService.getTrangThaiHt({
    //   nam: this.namHienTai,
    //   // maDvi: this.maBoNganh,
    //   listLoaiVthh: ['0101', '0102']
    // }).then(res => {
    //   if (res.msg == MESSAGE.SUCCESS) {
    //     for (let item in res.data) {
    //       let dataItem = res.data[item];
    //       if (dataItem.loaiVthh === '0101') {
    //         this.ltThocTon = dataItem.duDau;
    //         this.ltThocDuTru = dataItem.slHienThoi;
    //       } else if (dataItem.loaiVthh === '0102') {
    //         this.ltGaoTon = dataItem.duDau;
    //         this.ltGaoDuTru = dataItem.slHienThoi;
    //       }
    //     }
    //   }
    // })
  }

  onChangeInput() {
    this.ltThocMuaChange.emit(this.ltThocMua);
    this.ltThocXuatChange.emit(this.ltThocXuat);
    this.ltGaoXuatChange.emit(this.ltGaoXuat);
    this.ltGaoMuaChange.emit(this.ltGaoMua);
    this.ltGaoTonChange.emit(this.ltGaoTon);
    this.ltThocTonChange.emit(this.ltThocTon);
    this.ghiChuChange.emit(this.ghiChu);
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*if (!changes.maBoNganh.isFirstChange() || this.maBoNganh == '01') {
      this.initData();
    }*/
    // this.initData();
  }
}
