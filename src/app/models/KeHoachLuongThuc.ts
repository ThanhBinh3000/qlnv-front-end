import { ItemDetail } from './itemDetail';

export class KeHoachLuongThuc {
  id: number;
  stt: number;
  cucId: number;
  cucDTNNKhuVuc: string;
  tkdnTongSoQuyThoc: number;
  tkdnTongThoc: number;
  tkdnTongGao: number;
  tkdnThoc: Array<ItemDetail>;
  tkdnGao: Array<ItemDetail>;
  ntnTongSoQuyThoc: number;
  ntnThoc: number;
  ntnGao: number;
  xtnTongSoQuyThoc: number;
  xtnTongThoc: number;
  xtnTongGao: number;
  xtnThoc: Array<ItemDetail>;
  xtnGao: Array<ItemDetail>;
  tkcnTongSoQuyThoc: number;
  tkcnTongThoc: number;
  tkcnTongGao: number;
  tenDonvi: string;
  maDonVi: string;
  donViTinh: string;
}
