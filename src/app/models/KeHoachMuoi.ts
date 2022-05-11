import { ItemDetail } from './ItemDetail';

export class KeHoachMuoi {
  stt: number;
  cucId: number;
  cucDTNNKhuVuc: string;
  tenDonvi: string;
  tenDonVi: string;
  maDonVi: string;
  donViTinh: string;
  donViId: number;
  id: number;
  isEdit: boolean;

  tkdnTongSoMuoi: number;
  tkdnMuoi: Array<ItemDetail>;

  tdcNtnTongSoMuoi: number;
  ntnTongSoMuoi: number;
  dcNtnTongSoMuoi: number;
  sdcNtnTongSoMuoi: number;
  nhapTrongNam: string;

  tdcXtnTongSoMuoi: number;
  xtnTongSoMuoi: number;
  xtnMuoi: Array<ItemDetail>;
  xuatTrongNam: Array<ItemDetail>;
  tdcXtnMuoi: Array<ItemDetail>;
  dcXtnMuoi: Array<ItemDetail>;
  sdcXtnMuoi: Array<ItemDetail>;
  sdcXtnTongSoMuoi: number;

  tkcnTongSoMuoi: number;
}
