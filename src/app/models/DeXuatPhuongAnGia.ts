import { FileDinhKem } from "./FileDinhKem";

export class CanCuXacDinhPag {
  id: number;
  moTa: string;
  fileDinhKem: FileDinhKem = new FileDinhKem();

}

export class ThongTinKhaoSatGia {
  id: number;
  tenDviBaoGia: string;
  maDvi: string;
  maChiCuc: string;
  tenChiCuc: string;
  ttThamKhao : string;
  chiSoCpi : string;
  tenDviThamDinh: string;
  cloaiVthh: string;
  tieuChuanCl: string;
  tenCloaiVthh: string;
  donGia: number;
  donGiaVat: number;
  thoiHanBaoGia: string;
  ghiChu: string;
  fileDinhKem: FileDinhKem = new FileDinhKem();
}

export class ThongTinChungPag {
  id: number;
  maDvi : string;
  maChiCuc : string;
  maDiemKho : string;
  tenChiCuc : string;
  tenDiemKho : string;
  loaiVthh: string;
  tenLoaiVthh: string;
  cloaiVthh: string;
  tenCloaiVthh: string;
  tchuanCluong: string;
  soLuong: number;
  soLuongCtieu: number;
  donViTinh?: string;
  giaDn?: number;
  giaDnVat?: number;
  giaQdBtc: number;
  giaQdBtcVat : number;
  giaQdDcBtc: number;
  giaQdDcBtcVat : number;
  giaQdTcdt : number;
  giaQdTcdtVat : number;
  giaQdDcTcdt : number;
  giaQdDcTcdtVat : number;
  vat : number;
}

export class PhuongPhapXacDinhGia {
  id: number;
  cloaiVthh?: string;
  giaVonNk?: number = 0;
  chiPhiChung?: number = 0;
  chiPhiPhanBo?: number = 0;
  tongChiPhi?: number = 0;
  tenCloaiVthh?: string = '';
}

export class ThongTinGia {
  tieuChuanCl : string
  cloaiVthh: string
  donGia: number;
  donGiaVat: number;
  donViTinh: string
  id: number;
  maDvi: string;
  qdDcTcdtnnId: number;
  soLuong: 0;
  tenDvi: string;
  giaDn: number
  giaDnVat: number
  giaQd: number;
  giaQdVat: number;
}


