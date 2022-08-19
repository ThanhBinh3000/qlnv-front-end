import { FileDinhKem } from "./FileDinhKem"

export class QuyetDinhPheDuyetKeHoachBanDauGia {
    capDonVi: string;
    fileDinhKems: Array<FileDinhKem>;
    id: number;
    loaiVthh: string;
    maDonVi: string;
    maVatTu: string;
    maVatTuCha: string;
    namKeHoach: number;
    ngayHieuLuc: string;
    ngayKy: string;
    nguoiGuiDuyetId: number;
    nguoiPheDuyetId: number;
    soQuyetDinh: string;
    thoiHanTcBdg: string;
    tongHopDeXuatKhbdgId: number;
    trangThai: string;
    trichYeu: string;
    donViTinh: string;
    constructor(fileDinhKems: Array<FileDinhKem> = []) {
        this.fileDinhKems = fileDinhKems;
    }
}