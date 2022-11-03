import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuanLyHangTrongKhoService} from "../../../../services/quanLyHangTrongKho.service";

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

  @Input()
  isView: boolean = false;

  dataTable = [];
  namHienTai: number;
  ltThocTon: number;
  ltGaoTon: number;
  ltThocDuTru: number;
  ltGaoDuTru: number;

  constructor(private quanLyHangTrongKhoService: QuanLyHangTrongKhoService) {
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    let data_tmp = {
      "data": [
        {
          "ID": 426,
          "MA_DON_VI": "01",
          "MA_VTHH": "010101",
          "SL_HIEN_THOI": 4000.000,
          "NAM": "2022",
          "TEN_DON_VI": "Bộ tài chính",
          "TEN_VTHH": "Hạt rất dài",
          "DON_VI_TINH_ID": 2,
          "TEN_DON_VI_TINH": "Tấn",
          "DU_DAU": 1000,
          "TONG_NHAP": 5000,
          "TONG_XUAT": 2000,
          "LOAI_VTHH": "0101",
          "TEN_LOAI_VTHH": "Thóc",
          "CLOAI_VTHH": "010101",
          "TEN_CLOAI_VTHH": "Hạt dài"
        },
        {
          "ID": 427,
          "MA_DON_VI": "01",
          "MA_VTHH": "0102",
          "SL_HIEN_THOI": 8000.000,
          "NAM": "2022",
          "TEN_DON_VI": "Bộ tài chính",
          "TEN_VTHH": "Hạt rất dài",
          "DON_VI_TINH_ID": 2,
          "TEN_DON_VI_TINH": "Tấn",
          "DU_DAU": 4000,
          "TONG_NHAP": 7000,
          "TONG_XUAT": 3000,
          "LOAI_VTHH": "0102",
          "TEN_LOAI_VTHH": "Gạo",
          "CLOAI_VTHH": "010201",
          "TEN_CLOAI_VTHH": "Gạo hạt dài 5% tấm"
        }
      ]
    }
    /* console.log(this.keHoach)
     this.quanLyHangTrongKhoService.getTrangThaiHt({
       nam: this.namHienTai,
       maDvi: this.keHoach.maDvi,
       listLoaiVthh: ['0101']
     }).then(res => {
       console.log(res,11111111111)
       if(res.msg == MESSAGE.SUCCESS){

       }
     })*/
    for (let dataTmpKey in data_tmp.data) {
      let dataItem = data_tmp.data[dataTmpKey];
      if (dataItem.LOAI_VTHH === '0101') {
        this.ltThocTon = dataItem.DU_DAU;
        this.ltThocDuTru = dataItem.SL_HIEN_THOI;
      } else if (dataItem.LOAI_VTHH === '0102') {
        this.ltGaoTon = dataItem.DU_DAU;
        this.ltGaoDuTru = dataItem.SL_HIEN_THOI;
      }
    }
  }

  onChangeInput() {
    this.ltThocMuaChange.emit(this.ltThocMua);
    this.ltThocXuatChange.emit(this.ltThocXuat);
    this.ltGaoXuatChange.emit(this.ltGaoXuat);
    this.ltGaoMuaChange.emit(this.ltGaoMua);
  }
}
