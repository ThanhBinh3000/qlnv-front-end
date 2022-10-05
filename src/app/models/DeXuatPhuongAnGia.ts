import { FileDinhKem } from "./FileDinhKem";

export class CanCuXacDinhPag {
  id: number;
  moTa: string;
  fileDinhKem: FileDinhKem = new FileDinhKem();

}

export class ThongTinKhaoSatGia {
  id: number;
  tenDviBaoGia: string;
  cloaiVthh: string;
  tenCloaiVthh: string;
  donGia: string;
  donGiaVat: number;
  thoiHanBaoGia: number;
  ghiChu: number;
  fileDinhKem: FileDinhKem = new FileDinhKem();
}

export class ThongTinChungPag {
  id: number;
  cloaiVthh?: string;
  tenCloaiVthh?: string;
  tchuanCluong?: string;
  soLuong?: number;
  donViTinh?: string;
  giaDn?: number;
  giaDnVat?: number;
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
  donGia: number;
  donGiaVat: number;
  id: number;
  maDvi: string;
  qdDcTcdtnnId: number;
  soLuong: 0;
  tenDvi: string;
  donGiaBtc: number;
  donGiaBtcVat: number;
  giaQd: number;
  giaQdVat: number;
}


