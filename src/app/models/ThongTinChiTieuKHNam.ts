import { KeHoachVatTu } from './KeHoachVatTu';
import { KeHoachMuoi } from './KeHoachMuoi';
import { KeHoachLuongThuc } from './KeHoachLuongThuc';
export class ThongTinChiTieuKeHoachNam {
  id: number;
  namKeHoach: number;
  ngayHieuLuc: string;
  ngayKy: string;
  soQuyetDinh: string;
  tenTrangThai: string;
  trangThai: string;
  trichYeu: string;
  khLuongThuc: Array<KeHoachLuongThuc>;
  khMuoiDuTru: Array<KeHoachMuoi>;
  khVatTu: Array<KeHoachVatTu>;
}
