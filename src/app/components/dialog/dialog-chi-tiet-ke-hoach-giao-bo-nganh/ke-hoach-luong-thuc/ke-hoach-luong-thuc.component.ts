import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {QuanLyHangTrongKhoService} from "../../../../services/quanLyHangTrongKho.service";
import {MESSAGE} from "../../../../constants/message";

@Component({
  selector: 'app-ke-hoach-luong-thuc',
  templateUrl: './ke-hoach-luong-thuc.component.html',
  styleUrls: ['./ke-hoach-luong-thuc.component.scss'],
})
export class KeHoachLuongThucComponent implements OnInit, OnChanges {
  @Input() keHoach: any = {};
  @Output() keHoachChange = new EventEmitter<number>();
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

  @Input()
  isView: boolean = false;

  dataTable = [];
  @Input() namHienTai: number;
  @Input() maBoNganh: string;
  ltThocTon: number;
  ltGaoTon: number;
  ltThocDuTru: number;
  ltGaoDuTru: number;


  constructor(private quanLyHangTrongKhoService: QuanLyHangTrongKhoService) {
  }

  ngOnInit(): void {
    //this.initData();
  }

  initData() {
    this.quanLyHangTrongKhoService.getTrangThaiHt({
      nam: this.namHienTai,
      maDvi: this.maBoNganh,
      listLoaiVthh: ['0101', '0102']
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        for (let item in res.data) {
          let dataItem = res.data[item];
          if (dataItem.loaiVthh === '0101') {
            this.ltThocTon = dataItem.duDau;
            this.ltThocDuTru = dataItem.slHienThoi;
          } else if (dataItem.loaiVthh === '0102') {
            this.ltGaoTon = dataItem.duDau;
            this.ltGaoDuTru = dataItem.slHienThoi;
          }
        }
      }
    })
  }

  onChangeInput() {
    this.ltThocMuaChange.emit(this.ltThocMua);
    this.ltThocXuatChange.emit(this.ltThocXuat);
    this.ltGaoXuatChange.emit(this.ltGaoXuat);
    this.ltGaoMuaChange.emit(this.ltGaoMua);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.maBoNganh.isFirstChange()) {
      this.initData();
    }
  }
}
