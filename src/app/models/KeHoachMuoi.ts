import { ItemDetail } from './itemDetail';

export class KeHoachMuoi {
  stt: number;
  tenDonvi: string;
  tenDonVi: string;
  maDonVi: string;
  maDvi: string;
  donViTinh: string;
  donViId: number;
  id: number;
  isEdit: boolean;
  //Hoaot updated
  tonKhoDauNam: number;
  nhapTrongNam: number;
  xuatTrongNamMuoi: number;
  tonKhoCuoiNam: number;
  tkdnTongSoMuoi: number;
  tkdnMuoi: Array<ItemDetail>;
  tdcNtnTongSoMuoi: number;
  ntnTongSoMuoi: number;
  dcNtnTongSoMuoi: number;
  tdcXtnTongSoMuoi: number;
  xtnTongSoMuoi: number;
  xtnMuoi: Array<ItemDetail>;
  xuatTrongNam: Array<ItemDetail>;
  tdcXtnMuoi: Array<ItemDetail>;
  dcXtnMuoi: Array<ItemDetail>;
  sdcXtnMuoi: Array<ItemDetail>;
  sdcXtnTongSoMuoi: number;

  tkcnTongSoMuoi: number;

  constructor(detail: Array<ItemDetail> = []) {
    this.tkdnMuoi = detail;
    this.xtnMuoi = detail;
    this.xuatTrongNam = detail;
    this.tdcXtnMuoi = detail;
    this.dcXtnMuoi = detail;
    this.sdcXtnMuoi = detail;
  }
}
