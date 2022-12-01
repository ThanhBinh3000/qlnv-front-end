import { Validators } from "@angular/forms";


export class DanhSachMuaTrucTiep {
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
  dgiaChuaThue: number;
  thueGtgt: number;
  thanhTien: number;
  luaChon: boolean = false;
  luaChonPduyet: number;
  idSoQdPduyetCgia: number;
  idTkhaiKh: number;
  fileDinhKems: FileDinhKem = new FileDinhKem();
}

