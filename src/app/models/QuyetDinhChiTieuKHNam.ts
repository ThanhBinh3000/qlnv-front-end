import { KeHoachVatTu } from './KeHoachVatTu';
import { KeHoachMuoi } from './KeHoachMuoi';
import { KeHoachLuongThuc } from './KeHoachLuongThuc';
export class QuyetDinhChiTieuKHNam {
    id: number;
    khLuongThuc: Array<KeHoachLuongThuc>;
    khMuoi: Array<KeHoachMuoi>;
    khVatTu: Array<KeHoachVatTu>;
    namKeHoach: number;
    ngayHieuLuc: string;
    ngayKy: string;
    soQuyetDinh: string;
    trichYeu: string;
    ghiChu: string;
    trangThai: string;
    tenTrangThai: string;
}
