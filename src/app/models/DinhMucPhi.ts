import {Validators} from "@angular/forms";

export class DinhMucPhiNxBq {
  id: number;
  maDinhMuc: string;
  tenDinhMuc: string;
  apDungTai: string;
  apDungTaiStr: string;
  loaiDinhMuc:string;
  loaiBaoQuan:string;
  htBaoQuan:string;
  donViTinh: string;
  tongDinhMucTc: number = 0;
  tcTongCucDieuHanhKv: number = 0;
  nvChuyenMonTc: number = 0;
  ttCaNhanTc: number = 0;
  tcDieuHanhTc: number = 0;
  nvChuyenMonKv: number = 0;
  ttCaNhanKv: number = 0;
  tcDieuHanhKv: number = 0;
  tongCongMucChiVpCuc: number = 0;
  congMucChiVpCuc: number = 0;
  tongCongMucChiCuc: number = 0;
  congMucChiCuc: number = 0;
  tongDinhMucChiDonVi: number = 0;
  ngayHieuLuc: string;
  trangThai: string = '00';
  loaiVthh:string;
  cloaiVthh:string;
}
