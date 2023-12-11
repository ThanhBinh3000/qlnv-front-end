import {Validators} from "@angular/forms";

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
  id: number;
  idDtl: number;
  idDviDtl: number;
  tochucCanhan: string;
  mst: string;
  diaDiemChaoGia: string;
  sdt: string;
  ngayChaoGia: number;
  soLuong: number;
  donGia: number;
  thueGtgt: number;
  luaChon: boolean = false;
  thanhTien: number;
  fileDinhKems: FileDinhKem = new FileDinhKem();
}

export class ChiTietCacChiCucHopDong {
  id: number;
  idHdr: number;
  maDvi: string;
  soLuong: number;
  diaDiemChaoGia: string;
  diaChi: string;
}

export class chiTietBangCanKeHang {
  id: number;
  maCan: string;
  soBaoBi: string;
  trongLuongCaBi: number;
}
