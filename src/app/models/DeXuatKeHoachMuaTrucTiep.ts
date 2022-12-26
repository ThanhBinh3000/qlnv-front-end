import { Validators } from "@angular/forms";


export class DanhSachMuaTrucTiep {
  id: number;
  maDvi: string;
  tenDvi: string;
  maDiemKho: string;
  tenDiemKho: string;
  diaDiemNhap: string;
  donGiaVat: number;
  soLuong: number;
  donGia: number;
  thanhTien: number;
  tenGoiThau: string;
  soLuongChiTieu: number;
  soLuongKhDd: number;
  tongThanhTienVat: number;
  tongSoLuong: number;
  tongThanhTien: number;
  thanhTienVat: number;
  tongDonGia: number;
  loaiVthh: string;
  cloaiVthh: string;
  idVirtual?: number;
  isEdit: boolean;
  children?: DanhSachMuaTrucTiep[];
  level?: number;
  expand?: boolean;
  parent?: DanhSachMuaTrucTiep
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
  noiDung: string;
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

export class ChiTietThongTinChaoGia {
  id: number;
  canhanTochuc: string;
  mst: string;
  diaChi: string;
  sdt: string;
  ngayChaoGia: number;
  soLuong: number;
  donGia: number;
  thueGtgt: number;
  thanhTien: number;
  luaChon: boolean = false;
  luaChonPduyet: number;
  idSoQdPduyetCgia: number;
  idTkhaiKh: number;
  fileDinhKems: FileDinhKem = new FileDinhKem();
}

