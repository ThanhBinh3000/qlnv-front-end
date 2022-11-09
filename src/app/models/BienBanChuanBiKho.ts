export class BienBanChuanBiKho {
  htBaoQuan: string;
  id: number;
  keToanDonVi: string;
  ketLuan: string;
  kyThuatVien: string;
  loaiHinhKho: string;
  maDiemKho: string;
  maNganKho: string;
  maNganLo: string;
  maNhaKho: string;
  maVatTu: string;
  maVatTuCha: string;
  tenVatTu: string;
  tenVatTuCha: string;
  nam: number;
  ngayNghiemThu: string;
  ptBaoQuan: string;
  qdgnvnxId: number;
  so: number;
  soBienBan: string;
  thuKho: string;
  thuTruongDonVi: string;
  thucNhap: string;
  tongSo: number;
  chiTiets: Array<ChiTietBienBanChuanBiKho>;
  tenDvi: string;
  maDvi: string;
  tenHang: string;
  chungLoaiHang: string;
  tichLuong: string;
  dinhMucDuocGiao: string;
  trangThai: string;
  tenTrangThai: string;
  soHopDong: string;
  hopDongId: number;

  constructor(chiTiets: Array<ChiTietBienBanChuanBiKho> = []) {
    this.chiTiets = chiTiets;
  }
}

export class ChiTietBienBanChuanBiKho {
  bbChuanBiKhoId: number;
  donGiaTrongNam: number;
  donViTinh: string;
  id: number;
  noiDung: string;
  soLuongQt: number;
  soLuongTrongNam: number;
  thanhTienQt: number;
  thanhTienTrongNam: number;
  tongGiaTri: number;
  isEdit: boolean;
  idVirtual: number;
}
