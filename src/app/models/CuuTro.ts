export class DiaDiemNhapKho {
  id: number;
  idVirtual: number;
  maDvi: string;
  tenDvi: string;
  maChiCuc: string;
  tenChiCuc: string;
  soLuong: number = 0;
  soLuongTheoChiTieu: number = 0;
  slDaLenKHBan: number = 0;
  thanhTien: number = 0;
  tongKhoanTienDatTruoc: string;
  tongGiaKhoiDiem: string;
  donViTinh: string;
  chiTietDiaDiems: Array<ChiTietDiaDiemNhapKho>;

  constructor(chiTietDiaDiems: Array<ChiTietDiaDiemNhapKho> = []) {
    this.chiTietDiaDiems = chiTietDiaDiems;
  }
}

export class ChiTietDiaDiemNhapKho {
  idDxuatDtl: number;
  maDvi:string;
  maChiCuc:string;
  maDiemKho: string;
  maNhaKho: string;
  maNganKho: string;
  maLoKho: string;
  tenDvi:string;
  tenChiCuc:string;
  tenDiemKho: string;
  tenNhaKho: string;
  tenNganKho: string;
  tenLoKho: string;
  chungLoaiHh: string;
  tenChungLoaiHh: string;
  donViTinh: string;
  maDviTaiSan: string;
  tonKho: number = 0;
  soLuong: number = 0;
  donGiaChuaVAT: number = 0;
  donGia: number = 0;
  giaKhoiDiem: number = 0;
  soTienDatTruoc: number = 0;
  idVirtual: number;
  soLanTraGia: number = 0;
  donGiaCaoNhat: number = 0;
  traGiaCaoNhat: string;
  hoTen: string;
  thanhTien: number = 0;
  isEdit: boolean;
  cloaiVthh: string;
  tenCloaiVthh: string;

  constructor(tonKho: number = 0) {
    this.tonKho = tonKho;
  }
}

export class FileDinhKem {
  createDate: string;
  dataType: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileUrl: string;
  id: number;
  idVirtual: number;
}
