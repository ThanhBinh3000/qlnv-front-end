import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  selector: 'app-thongtin-daugia',
  templateUrl: './thongtin-daugia.component.html',
  styleUrls: ['./thongtin-daugia.component.scss']
})
export class ThongtinDaugiaComponent implements OnInit {

  @Input() data

  formData: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      loaiVthh: [],
      cloaiVthh: [],
      idQdPdKh: [],
      soQdPdKh: [],
      idQdDcKh: [],
      soQdDcKh: [],
      idQdPdKq: [],
      soQdPdKq: [],
      idKhDx: [],
      soKhDx: [],
      ngayQdPdKqBdg: [],
      thoiHanGiaoNhan: [],
      thoiHanThanhToan: [],
      phuongThucThanhToan: [],
      phuongThucGiaoNhan: [],
      trangThai: [],
      maDviThucHien: [],
      tongTienGiaKhoiDiem: [],
      tongTienDatTruoc: [],
      tongTienDatTruocDuocDuyet: [],
      tongSoLuong: [],
      phanTramDatTruoc: [],
      thoiGianToChucTu: [],
      thoiGianToChucDen: [],
      tenDvi: [],
      tenDviThucHien: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      soDviTsan: [],
      soDviTsanThanhCong: [],
      soDviTsanKhongThanh: [],
    })
  }

  ngOnInit(): void {
  }

}
