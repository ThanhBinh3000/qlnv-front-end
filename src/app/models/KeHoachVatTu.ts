import { ItemDetail } from './ItemDetail';
export class KeHoachVatTu {
  namKeHoach: number;
  ngayHieuLuc: string;
  ngayKy: string;
  soQuyetDinh: string;
  tenTrangThai: string;
  trangThai: string;
  trichYeu: string;
}

export class VatTuThietBi {
  donViTinh: string;
  maVatTu: string;
  maVatTuCha: string;
  nhapTrongNam: number;
  stt: number;
  tenVatTu: string;
  tenVatTuCha: string;
  tongCacNamTruoc: number;
  tongNhap: number;
  vatTuChaId: number;
  vatTuId: number;
  cacNamTruoc: Array<CacNamTruoc>;
}

export class CacNamTruoc {
  id: number;
  nam: number;
  soLuong: number;
  vatTuId: number;
}
