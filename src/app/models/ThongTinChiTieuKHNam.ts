import {KeHoachVatTu, KeHoachVatTuCustom} from './KeHoachVatTu';
import { KeHoachMuoi } from './KeHoachMuoi';
import { KeHoachLuongThuc } from './KeHoachLuongThuc';
import { FileDinhKem } from './FileDinhKem';
import {STATUS} from "../constants/status";
export class ThongTinChiTieuKeHoachNam {
  id: number;
  namKeHoach: number;
  ngayHieuLuc: string;
  ngayKy: string;
  soQuyetDinh: string;
  tenTrangThai: string;
  trangThai: string = STATUS.DANG_NHAP_DU_LIEU;
  trichYeu: string;
  loai:string;
  khLuongThuc: Array<KeHoachLuongThuc> = [];
  khMuoiDuTru: Array<KeHoachMuoi> = [];
  khVatTu: Array<KeHoachVatTu> = [];
  khVatTuNhap: Array<any> = [];
  khVatTuXuat: Array<any> = [];
  ghiChu: string;
  khMuoi: Array<KeHoachMuoi> = [];
  loaiCanCu:string;
  canCu: string;
  idCanCu: number;
  capDvi:string;
  tenDvi:string;
  fileDinhKemReqs: Array<FileDinhKem>;
  qdGocId: number;
  soQdGoc: string;
  chiTieuId: number;
  lyDoTuChoi:string;
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
