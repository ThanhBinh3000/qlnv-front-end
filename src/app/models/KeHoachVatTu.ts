import { ItemDetail } from './ItemDetail';
export class KeHoachVatTu {
  id: number;
  donViId: number;
  maDonVi: string;
  tenDonVi: string;
  donViTinh: string;
  stt: number;
  vatTuThietBi: Array<VatTuThietBi>;
  listDisplay: Array<any>;
  maHang: string;
  kyHieu: string;
  tenHang: string;
  chungLoaiHang: string;
  tongChiTieuNhapTrongNam: number;
  tongChiTieuCacnamTruoc: number;
  chiTieuNhapCacNamTruoc: Array<ItemDetail>;
  keHoachNamHienTai: number;
  isEdit: boolean;
  keHoachNamHienTaiDc: number;
}

export class NhomVatTuThietBi {
  donViTinh: string;
  maVatTuCha: string;
  nhapTrongNam: number;
  stt: number;
  tenVatTuCha: string;
  tongCacNamTruoc: number;
  tongNhap: number;
  vatTuChaId: number;
  cacNamTruoc: Array<CacNamTruoc>;
  vatTuThietBi: Array<VatTuThietBi>;
}

export class CacNamTruoc {
  id: number;
  nam: number;
  soLuong: number;
  vatTuId: number;
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
  id: number;
}
