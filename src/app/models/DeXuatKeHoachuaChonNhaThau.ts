import {Validators} from "@angular/forms";

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
  noiDung: string;
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
  donGiaVat: number;
  donGiaTamTinh: number;
  donGiaDx: number;
  goiThau: string;
  id: number;
  soLuong: number;
  soLuongTheoChiTieu: number;
  soLuongDaMua: number;
  thanhTien: string;
  bangChu: string;
  giaTriDamBao: string
  idVirtual?: number;
  isEdit: boolean;
  children?: DanhSachGoiThau[];
  level?: number;
  expand?: boolean;
  parent?: DanhSachGoiThau
  thanhTienDx?: number;
  thanhTienQd?: number;
  giaToiDa: number;
}

export class CanCuXacDinh {
  id: number;
  idVirtual: number;
  loaiCanCu: string;
  tenTlieu: string;
  noiDung: string;
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
  soLuongDuToan: number;
}

export class KeHoachMuaXuat {
  id: number;
  idDanhMuc: number;
  idNoiDung: number;
  noiDung: string;
  sluongDtoan: number;
  loaiChi: string;
  tenLoaiChi: string;
  nguonChi: string;
  tenNguonChi: string;
}

export class DanhMucMucPhi {
  id: number
  cloaiVthh: string
  tencLoaiVthh: string
  hinhThucBq: string
  nhomDinhMuc: string
  loaiDinhMuc: string
  loaiHinhBq: string
  dviTinh: string
  loaiVthh: string
  tenLoaiVthh: string
  maDinhMuc: string
  tenDinhMuc: string
  trangThai: string
}

export class DanhMucCongCuDungCu {
  id: number
  maCcdc: string
  tenCcdc: string
  moTa: string
  donViTinh: string
  nhomCcdc: string
  trangThai: string
  yeuCauKt: string
}


