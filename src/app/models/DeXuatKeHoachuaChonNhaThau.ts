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
  tgianNhapHang: string;
  tenDuAn: string = '';
  tgianDongThau: string;
  tgianMoThau: string;
  tgianTbao: string;
  tgianThHienHd: string;
  tongMucDt: number;
  tuNgayThHien: string;
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
  maDvi: string;
  tenDvi: string;
  maDiemKho: string;
  tenDiemKho: string;
  diaDiemNhap: string;
  donGia: number;
  goiThau: string;
  id: number;
  soLuong: number;
  soLuongTheoChiTieu: number;
  thanhTien: string;
  bangChu: string;
  idVirtual?: number;
  isEdit: boolean;
  children?: DanhSachGoiThau[];
  level?: number;
  expand?: boolean;
  parent?: DanhSachGoiThau
}
export class CanCuXacDinh {
  id: number;
  idVirtual: number;
  loaiCanCu: string;
  tenTlieu: string;
  taiLieu: any;
  moTa: string;
  fileDinhKems: Array<FileDinhKem>;
  children: Array<FileDinhKem>;
}

export class ThongTinQuyetDinh {
  id: number;
  loaiVthh: string;
  tenVthh: string;
  cloaiVthh: string;
  tenCloaiVthh: string;
  dviTinh: string;
  soLuong: number;
  donGia: number;
  tongTien: number;
}

export class KeHoachMuaXuat {
  id: number;
  idDanhMuc: number;
  idNoiDung: number;
  noiDung: string;
  sluongDtoan: number;
}
