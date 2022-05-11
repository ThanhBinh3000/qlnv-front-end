import { ItemDetail } from './ItemDetail';

export class KeHoachLuongThuc {
  id: number;
  stt: number;
  cucId: number;
  cucDTNNKhuVuc: string;
  tenDonvi: string;
  maDonVi: string;
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
  sdcNtnTongSoQuyThoc: number;
  sdcNtnThoc: number;
  sdcNtnGao: number;

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
  sdcXtnTongSoQuyThoc: number;
  sdcXtnTongThoc: number;
  sdcXtnTongGao: number;
  sdcXtnThoc: Array<ItemDetail>;
  sdcXtnGao: Array<ItemDetail>;
}
