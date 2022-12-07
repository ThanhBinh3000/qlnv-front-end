import {KeHoachVatTu, KeHoachVatTuCustom} from './KeHoachVatTu';
import { KeHoachMuoi } from './KeHoachMuoi';
import { KeHoachLuongThuc } from './KeHoachLuongThuc';
import { FileDinhKem } from './FileDinhKem';
export class ThongTinChiTieuKeHoachNam {
  id: number;
  namKeHoach: number;
  ngayHieuLuc: string;
  ngayKy: string;
  soQuyetDinh: string;
  tenTrangThai: string;
  trangThai: string = '00';
  trichYeu: string;
  khLuongThuc: Array<KeHoachLuongThuc> = [];
  khMuoiDuTru: Array<KeHoachMuoi> = [];
  khVatTu: Array<KeHoachVatTu> = [];
  khVatTuNhap: Array<any> = [];
  khVatTuXuat: Array<any> = [];
  ghiChu: string;
  khMuoi: Array<KeHoachMuoi> = [];
  canCu: string;
  fileDinhKemReqs: Array<FileDinhKem>;
  qdGocId: number;
  soQdGoc: string;
  chiTieuId: number;
  constructor(
    fileDinhKemReqs: Array<FileDinhKem> = [],
  ) {
    this.fileDinhKemReqs = fileDinhKemReqs;
  }
}
export class TonKhoDauNamLuongThuc {
  maDonVi: string;
  maVthh: string;
  nam: string;
  slHienThoi: number;
}
