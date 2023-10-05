import { FileDinhKem } from "./FileDinhKem"

export class PhieuNhapKhoTamGui {
  id: number;
  loaiVthh: string;
  maDiemKho: string;
  maNganKho: string;
  maNganLo: string;
  maNhaKho: string;
  ngayNhapKho: string;
  ngayTaoPhieu: string;
  nguoiGiaoHang: string;
  no: string;
  qdgnvnxId: string;
  soPhieu: string;
  thoiGianGiaoNhanHang: string;
  tongSoLuong: string;
  tongSoTien: string;
  fileDinhKems: Array<FileDinhKem>;
  co: string;
  chiTiets: Array<ChiTiet>;

  constructor(fileDinhKems: Array<FileDinhKem> = [], chiTiets: Array<ChiTiet> = []) {
    this.fileDinhKems = fileDinhKems;
    this.chiTiets = chiTiets;
  }
}
export class ChiTiet {
  donGia: string;
  donViTinh: string;
  id: string;
  maSo: string;
  phieuNkTgId: string;
  soLuongChungTu: string;
  soLuongThucNhap: string;
  stt: string;
  thanhTien: string;
  vthh: string;
}