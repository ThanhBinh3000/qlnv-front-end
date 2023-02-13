import { Validators } from "@angular/forms";

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

export class ChiTietThongTinBanTrucTiepChaoGia {
  idDtl: number;
  id: number;
  tochucCanhan: string;
  mst: string;
  diaDiemChaoGia: string;
  sdt: string;
  ngayChaoGia: number;
  soLuong: number;
  donGia: number;
  thueGtgt: number;
  luaChon: boolean = false;
  idSoQdPduyetCgia: number;
  fileDinhKems: FileDinhKem = new FileDinhKem();
}

