import {ItemDetail} from './itemDetail';

export class KhVatTu {
  id: number;
  donViId: number;
  maDvi: string;
  tenDvi: string;
  donViTinh: string;
  kyHieu: string;
  sttDonVi: number;
  vatTuId: number;
  vatTuChaId: number;
  maVatTu: string;
  maVatTuCha: string;
  tenVatTu: string;
  tenVatTuCha: string;
  maHang: string;
  soLuongNhap: number;
  soLuongXuat: number;
  namNhap: number;
  soLuongChuyenSang: number;
}

export class KeHoachVatTu {
  id: number;
  donViId: number;
  maDvi: string;
  tenDonVi: string;
  donViTinh: string;
  stt: number;
  vatTuThietBi: Array<VatTuThietBi>;
  listDisplay: Array<any>;
  maHang: string;
  kyHieu: string;
  tenHang: string;
  chungLoaiHang: string;
  tongChiTieuCacnamTruoc: number;
  chiTieuNhapCacNamTruoc: Array<ItemDetail>;
  isEdit: boolean;
  maDonVi: string;

  constructor(vatTuThietBi: Array<VatTuThietBi> = [], detail: Array<ItemDetail> = []) {
    this.vatTuThietBi = vatTuThietBi;
    this.vatTuThietBi[0] = new VatTuThietBi();
    this.chiTieuNhapCacNamTruoc = detail;
  }
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
  sdcNhapTrongNam: number;
  tdcNhapTrongNam: number;
  dcNhapTrongNam: number;
  stt: number;
  tenVatTu: string;
  tenVatTuCha: string;
  tongCacNamTruoc: number;
  sdcTongCacNamTruoc: number;
  tdcTongCacNamTruoc: number;
  tongNhap: number;
  sdcTongNhap: number;
  tdcTongNhap: number;
  vatTuChaId: number;
  vatTuId: number;
  cacNamTruoc: Array<CacNamTruoc>;
  sdcCacNamTruoc: Array<CacNamTruoc>;
  tdcCacNamTruoc: Array<CacNamTruoc>;
  id: number;
  kyHieu: string;
  tenHang: string;
  chungLoaiHang: string;

  constructor(cacNamTruoc: Array<CacNamTruoc> = []) {
    this.cacNamTruoc = cacNamTruoc;
    this.cacNamTruoc[0] = new CacNamTruoc();

    this.sdcCacNamTruoc = cacNamTruoc;
    this.sdcCacNamTruoc[0] = new CacNamTruoc();

    this.tdcCacNamTruoc = cacNamTruoc;
    this.tdcCacNamTruoc[0] = new CacNamTruoc();
  }
}

export class KeHoachVatTuCustom {
  id: number;
  sttDonVi: number;
  donViId: number;
  maDvi: string;
  tenDvi: string;
  dsVatTu: Array<VatTuCustom> = new Array<VatTuCustom>();

  constructor(dsVatTu: Array<VatTuCustom> = []) {
    this.dsVatTu = dsVatTu;
    this.dsVatTu[0] = new VatTuCustom();
  }
}

export class VatTuCustom {
  id: number;
  maHang: string;
  kyHieu: string;
  maVatTu: string;
  maVatTuCha: string;
  soLuongChuyenSang: number;
  soLuongNhap: number;
  donViTinh: string;
  loai: string;
  stt: number;
  tenVatTu: string;
  tenVatTuCha: string;
  vatTuChaId: number;
  vatTuId: number;
  isEdit: boolean = false;
  sttDonVi: number;
  donViId: number;

  constructor() {
  }
}
