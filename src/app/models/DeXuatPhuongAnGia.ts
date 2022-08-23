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
  cloaiVthh?: string;
  tchuanCluong?: string;
  soLuong?: number;
  donViTinh?: string;
  giaDn?: number;
  giaDnVat?: number;
}

export class PhuongPhapXacDinhGia {
  cloaiVthh?: string;
  giaVonNk?: number = 0;
  chiPhiChung?: number = 0;
  chiPhiPhanBo?: number = 0;
  tongChiPhi?: number = 0;
}


