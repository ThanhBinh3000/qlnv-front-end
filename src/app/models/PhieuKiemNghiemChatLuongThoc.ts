export class PhieuKiemNghiemChatLuongHang {
  chiSoChatLuong: string;
  ddiemBquan: string;
  diemKhoId: string;
  hthucBquan: string;
  id: number;
  maDiemKho: string;
  maHhoa: string;
  maNganKho: string;
  maNganLo: string;
  maNhaKho: string;
  nganLoId: number;
  ngayKnghiem: string;
  ngayLayMau: string;
  ngayNhapDay: string;
  nhaKhoId: number;
  qdgnvnxId: number;
  sluongBquan: number;
  soBbanKthucNhap: string;
  soPhieu: string;
  tenDiemKho: string;
  tenHhoa: string;
  tenNganLo: string;
  tenNhaKho: string;
  tenNganKho: string;
  tenTrangThai: string;
  trangThaiDuyet: string;
  trangThai: string;
  tinhTrang: string;
  tenDonVi: string;
  maDonVi: string;
  thuKho: string;
  ketLuan: string;
  ketQuaDanhGia: string;
  soQd: string;
  bbBanGiaoMauId: number;
  maVatTuCha: string;
  kquaKnghiem: Array<KetQuaKiemNghiemChatLuongHang>;
  constructor(ketQuaKiemNghiem: Array<KetQuaKiemNghiemChatLuongHang> = []) {
    this.kquaKnghiem = ketQuaKiemNghiem;
  }
}

export class KetQuaKiemNghiemChatLuongHang {
  chiSoChatLuong: string;
  donVi: string;
  id: number;
  kquaKtra: string;
  phieuKnghiemId: number;
  pphapXdinh: string;
  stt: number;
  tenCtieu: string;
  isEdit: boolean;
}
