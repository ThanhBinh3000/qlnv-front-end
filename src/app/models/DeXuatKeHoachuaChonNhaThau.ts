export class ThongTinDeXuatKeHoachLuaChonNhaThau {
  id: number;
  ldoTuchoi: string;
  loaiVthh: string;
  maHangHoa: string;
  maDvi: string;
  namKhoach: number;
  ngayGuiDuyet: string;
  ngayKy: string;
  ngayPduyet: string;
  ngaySua: string;
  ngayTao: string;
  nguoiGuiDuyet: string;
  nguoiPduyet: string;
  nguoiSua: string;
  nguoiTao: string;
  qdCanCu: string;
  soDxuat: string;
  tenDvi: string;
  trangThai: string;
  trichYeu: string;
  children?: Array<FileDinhKem> = [];
  children1?: Array<ThongTinChung> = [];
  children2?: Array<DanhSachGoiThau> = [];
  children3?: Array<CanCuXacDinh> = [];
  ghiChu: string;
}
export class ThongTinDeXuatKeHoachLuaChonNhaThauInput {
  id: number;
  ldoTuchoi: string;
  loaiVthh: string;
  maDvi: string;
  namKhoach: number;
  ngayGuiDuyet: string;
  ngayKy: string;
  ngayPduyet: string;
  ngaySua: string;
  ngayTao: string;
  nguoiGuiDuyet: string;
  nguoiPduyet: string;
  nguoiSua: string;
  nguoiTao: string;
  qdCanCu: string;
  soDxuat: string;
  tenDvi: string;
  trangThai: string;
  trichYeu: string;
  ghiChu: string;
  detail1?: Array<ThongTinChung> = [];
  detail2?: Array<DanhSachGoiThau> = [];
  detail3?: Array<CanCuXacDinh> = [];
  children1?: Array<ThongTinChung> = [];
  children2?: Array<DanhSachGoiThau> = [];
  children3?: Array<CanCuXacDinh> = [];
  children?: Array<FileDinhKem> = [];
  fileDinhKems?: Array<FileDinhKem> = [];
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

export class ThongTinChung {
  blanhDthau: string;
  denNgayThHien: string;
  ghiChu: string;
  hthucLcnt: string;
  id: number;
  loaiHdong: string;
  nguonVon: string;
  pthucLcnt: string;
  tchuanCluong: string;
  tenDuAn: string = '';
  tgianDongThau: string;
  tgianMoThau: string;
  tgianNhapHang: string;
  tgianTbao: string;
  tgianThHienHd: string;
  tongMucDt: number;
  tuNgayThHien: string;
}

export class DanhSachGoiThau {
  diaDiemNhap: string;
  donGia: number;
  goiThau: string;
  id: number;
  soLuong: number;
  thanhTien: string;
  bangChu: string;
  idVirtual?: number;
  isEdit: boolean;
}
export class CanCuXacDinh {
  id: number;
  idVirtual: number;
  loaiCanCu: string;
  tenTlieu: string;
  fileDinhKems: Array<FileDinhKem>;
  children: Array<FileDinhKem>;
}
