import { KeHoachVatTu } from './KeHoachVatTu';
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
  trangThai: string;
  trichYeu: string;
  khLuongThuc: Array<KeHoachLuongThuc> = [];
  khMuoiDuTru: Array<KeHoachMuoi> = [];
  khVatTu: Array<KeHoachVatTu> = [];
  ghiChu: string;
  khMuoi: Array<KeHoachMuoi> = [];
  canCu: string;
  fileDinhKemReqs: Array<FileDinhKem>;
  constructor(fileDinhKemReqs: Array<FileDinhKem> = []) {
    this.fileDinhKemReqs = fileDinhKemReqs;
  }
}
export class TonKhoDauNamLuongThuc {
  maDonVi: string;
  maVthh: string;
  nam: string;
  slHienThoi: number;
}
