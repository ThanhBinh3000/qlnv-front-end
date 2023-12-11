export class ItemDetail {
  nam: number;
  public soLuong: number;
  vatTuId: number;
  id: number;
  constructor(soLuong?: number,nam?:number) {
    this.soLuong = soLuong;
    this.nam = nam;
  }
}
