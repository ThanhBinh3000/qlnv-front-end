import { ItemDetail } from './itemDetail';

export class KeHoachMuoi {
  stt: number;
  cucId: number;
  cucDTNNKhuVuc: string;
  tkdnTongSoMuoi: number;
  tkdnMuoi: Array<ItemDetail>;
  ntnTongSoMuoi: number;
  xtnTongSoMuoi: number;
  xtnMuoi: Array<ItemDetail>;
  xuatTrongNam: Array<ItemDetail>;
  tkcnTongSoMuoi: number;
  tenDonVi: string;
  maDonVi: string;
  donViTinh: string;
  donViId: number;
  id: number;
  nhapTrongNam: string;
  isEdit: boolean;
}
