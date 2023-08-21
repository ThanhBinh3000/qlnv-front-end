import { ItemDetail } from './itemDetail';

export class KeHoachLuongThuc {
  id: number;
  stt: number;
  tenDonvi: string;
  maDonVi: string;
  maDvi: string;
  donViTinh: string;
  donViId: number;
  khGaoId: number;
  khThocId: number;
  isEdit: boolean;
  tkdnTongSoQuyThoc: number;
  tkdnTongThoc: number;
  tkdnTongGao: number;
  tkdnThoc: Array<ItemDetail>;
  tkdnGao: Array<ItemDetail>;
  tkcnTongSoQuyThoc: number;
  tkcnTongThoc: number;
  tkcnTongGao: number;
  tdcNtnTongSoQuyThoc: number;
  tdcNtnThoc: number;
  tdcNtnGao: number;
  ntnTongSoQuyThoc: number;
  ntnThoc: number;
  ntnGao: number;
  dcNtnGao: number;
  dcNtnThoc: number;
  tdcXtnTongSoQuyThoc: number;
  tdcXtnTongThoc: number;
  tdcXtnTongGao: number;
  tdcXtnThoc: Array<ItemDetail>;
  tdcXtnGao: Array<ItemDetail>;
  xtnTongSoQuyThoc: number;
  xtnTongThoc: number;
  xtnTongGao: number;
  xtnThoc: Array<ItemDetail>;
  xtnGao: Array<ItemDetail>;
  dcXtnThoc: Array<ItemDetail>;
  dcXtnGao: Array<ItemDetail>;
  sdcXtnThoc: Array<ItemDetail>;
  sdcXtnGao: Array<ItemDetail>;

  constructor(detail: Array<ItemDetail> = []) {
    this.tkdnThoc = detail;
    this.tkdnGao = detail;
    this.tdcXtnThoc = detail;
    this.tdcXtnGao = detail;
    this.xtnThoc = detail;
    this.xtnGao = detail;
    this.dcXtnThoc = detail;
    this.dcXtnGao = detail;
    this.sdcXtnThoc = detail;
    this.sdcXtnGao = detail;
  }
}
