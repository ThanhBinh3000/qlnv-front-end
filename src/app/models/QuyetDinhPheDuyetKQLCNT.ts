import { FileDinhKem } from './FileDinhKem';

export class QuyetDinhPheDuyetKQLCNT {
  canCu: string;
  detail: Array<DetailQuyetDinhPheDuyetKQLCNT>;
  fileDinhKems: Array<FileDinhKem>;
  ghiChu: string;
  id: number;
  loaiVthh: string;
  maDvi: string;
  namKhoach: number;
  ngayQd: string;
  soQd: string;
  veViec: string;
}
export class DetailQuyetDinhPheDuyetKQLCNT {
  dgiaHdSauVat: number;
  dgiaSauVat: number;
  diaDiem: string;
  donGia: number;
  donGiaHd: number;
  giaGthau: number;
  id: number;
  idHdr: number;
  loaiHd: string;
  shgt: string;
  soLuong: number;
  tenDvi: string;
  tenGthau: string;
  vat: number;
  vatHd: number;
}
