import { FileDinhKem } from "./FileDinhKem"

export class TongHopDeNghiCapVon {
  fileDinhKem: FileDinhKem;
  capDvi: string;
  id: number;
  khDnCapVonIds: Array<number>;
  maDvi: string;
  maTongHop: string;
  nam: number;
  ngayTongHop: string;
  nguonTongHop: string;
  noiDung: string;
  maToTrinh: string;
  ct1s: Array<Ct1sTonghop>;
  constructor(khDnCapVonIds: Array<number> = [], ct1s: Array<Ct1sTonghop> = []) {
    this.khDnCapVonIds = khDnCapVonIds;
    this.ct1s = ct1s;
  }
}
export class Ct1sTonghop {
  khDnCapVonId: number;
  tcCapThem: number;
  tenBoNganh: string;
  loaiBn: string;
  loaiHang: string;
  maBn: string;
  tongTien: number;
  kinhPhiDaCap: number;
  ycCapThem: number;
  soDeNghi: string;
  ngayDeNghi: string;
  nam: number;
  loaiTien: string;
  tyGia: number;
  tcCapThemNt:number;
  tongTienNt: number;
  kinhPhiDaCapNt: number;
  ycCapThemNt: number;
}
