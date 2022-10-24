import { Validators } from "@angular/forms";


export class DanhSachMuaTrucTiep {
  id: number;
  maDvi: string;
  tenDvi: string;
  maDiemKho: string;
  tenDiemKho: string;
  diaDiemNhap: string;
  soLuongCtieu: number;
  soLuongKhDd: number;
  soLuongDxmtt: number;
  donGiaVat: number;
  bangChu: String;
  thanhTien: number;
  idVirtual?: number;
  isEdit: boolean;
  ccFileDinhkems?: DanhSachMuaTrucTiep[];
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
  fileDinhkems: Array<FileDinhKem>;
  ccFileDinhkems: Array<FileDinhKem>;
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
  fileDinhKems: FileDinhKem = new FileDinhKem();
}

