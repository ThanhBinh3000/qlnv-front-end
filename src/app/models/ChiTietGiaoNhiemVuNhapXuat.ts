import { ChiTietDonViQuyetDinh } from "./ChiTietDonViQuyetDinh";
import { ChiTietFile } from "./ChiTietFile";
import { ChiTietThongTinHangDTQG } from "./ChiTietThongTinHangDTQG";

export class ChiTietGiaoNhiemVuNhapXuat {
    ghiChu: string;
    id: number;
    ldoTuchoi: string;
    loaiQd: string;
    maDvi: string;
    tenDvi: string;
    ngayHluc: string;
    ngayKy: string;
    soHd: string;
    soQd: string;
    veViec: string;
    fileDinhKems: ChiTietFile;
    detail: Array<ChiTietDonViQuyetDinh>;
    detail1: Array<ChiTietThongTinHangDTQG>;
}
