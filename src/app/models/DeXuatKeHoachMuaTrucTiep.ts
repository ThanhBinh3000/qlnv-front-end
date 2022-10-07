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

