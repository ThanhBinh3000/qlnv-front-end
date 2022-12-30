import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  selector: 'app-thongtin-daugia',
  templateUrl: './thongtin-daugia.component.html',
})
export class ThongtinDaugiaComponent implements OnInit {

  @Input() data

  isModal = false;

  formData: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get("year"), [Validators.required]],
      maThongBao: [],
      trichYeuThongBao: [],
      tenToChuc: [],
      sdt: [],
      diaChi: [],
      taiKhoanNganHang: [],
      soHopDong: [],
      ngayKyHopDong: [],
      hinhThucToChuc: [],
      thoiGianThamGia: [],
      ghiChuThoiGianThamGia: [],
      diaDiemNopHoSo: [],
      dieuKienDangKy: [],
      tienHoSo: [],
      buocGia: [],
      tgianXemTaiSan: [],
      ghiChuTgianXemTaiSan: [],
      diaDiemXemTaiSan: [],
      tgianNopTien: [],
      ghiChuTgianXem: [],
      pthucThanhToan: [],
      donViThuHuong: [],
      stk: [],
      nganHang: [],
      chiNhanhNganHang: [],
      tgianToChucDauGia: [],
      diaDiemToChucDauGia: [],
      hthucDauGia: [],
      pthucDauGia: [],
      dieuKien: [],
      ghiChu: [],
      ketQuaDauGia: [],
      soBienBanDauGia: [],
      trichYeuKetQua: [],
    })
  }

  ngOnInit(): void {
  }

  handleCancel() {

  }

}
