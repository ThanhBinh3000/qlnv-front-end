import { FileDinhKem } from "./FileDinhKem"

export class DeNghiCapPhiBoNganh {
  capDvi: string;
  fileDinhKemReqs: Array<FileDinhKem>;
  ghiChu: string;
  id: number;
  maBoNganh: string;
  tenBoNganh: string;
  maDvi: string;
  nam: number;
  ngayDeNghi: string;
  soDeNghi: string;
  ct1List: Array<Ct1DeNghiCapPhi>;
  constructor(ct1List: Array<Ct1DeNghiCapPhi> = []) {
    this.ct1List = ct1List;
  }
}
export class Ct1DeNghiCapPhi {
  ct2List: Array<Ct2DeNghiCapPhi>;
  dnCapPhiId: number;
  id: number;
  nganHang: string;
  soTaiKhoan: number;
  tenDvCungCap: string;
  ycCapThemPhi: number;
  constructor(ct2List: Array<Ct2DeNghiCapPhi> = []) {
    this.ct2List = ct2List;
  }
}
export class Ct2DeNghiCapPhi {
  capPhiBoNghanhCt1Id: number;
  id: number;
  kinhPhiDaCap: number;
  loaiChiPhi: string;
  maVatTu: string;
  maVatTuCha: string;
  namPhatSinh: number;
  tenHangHoa: string;
  tongTien: number;
  yeuCauCapThem: number;
}
