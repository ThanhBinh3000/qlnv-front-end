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
  trangThai: string = '00';
  trichYeu: string;
  khLuongThuc: Array<KeHoachLuongThuc> = [];
  khMuoiDuTru: Array<KeHoachMuoi> = [];
  khVatTu: Array<KeHoachVatTu> = [];
  ghiChu: string;
  khMuoi: Array<KeHoachMuoi> = [];
  canCu: string;
  fileDinhKemReqs: Array<FileDinhKem>;
  canCus: Array<FileDinhKem>;
  qdGocId: number;
  soQdGoc: string;
  chiTieuId: number;
  constructor(
    fileDinhKemReqs: Array<FileDinhKem> = [],
    canCus: Array<FileDinhKem> = [],
  ) {
    this.fileDinhKemReqs = fileDinhKemReqs;
    this.canCus = canCus;
  }
}
export class TonKhoDauNamLuongThuc {
  maDonVi: string;
  maVthh: string;
  nam: string;
  slHienThoi: number;
}
