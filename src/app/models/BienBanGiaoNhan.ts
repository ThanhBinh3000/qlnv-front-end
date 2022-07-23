import { FileDinhKem } from "./FileDinhKem"

export class BienBanGiaoNhan {
    bbGuiHangId: number;
    bbKtNhapKhoId: number;
    capDvi: string;
    chiTiets: Array<ChiTietBienBanGiaoNhan>;
    fileDinhKemReqs: Array<FileDinhKem>;
    ghiChu: string;
    hoSKyThuatId: number;
    hopDongId: number;
    id: number;
    ketLuan: string;
    lyDoTuChoi: string;
    maDvi: string;
    maVatTu: string;
    maVatTuCha: string;
    ngayHopDong: string;
    ngayKy: string;
    ngayKyBbGh: string;
    ngayKyHskt: string;
    qdgnvnxId: number;
    soBienBan: string;
    soLuong: number;
    trangThai: string;
    tenTrangThai: string;
    tenDvi: string;
    tenHang: string;
    chungLoaiHangHoa: string;
    soHd: string;
    constructor(chiTiets: Array<ChiTietBienBanGiaoNhan> = [], fileDinhKemReqs: Array<FileDinhKem> = []) {
        this.chiTiets = chiTiets;
        this.fileDinhKemReqs = fileDinhKemReqs;
    }
}

export class ChiTietBienBanGiaoNhan {
    bbGiaoNhanVtId: number;
    chucVu: string;
    daiDien: string;
    id: number;
    idVirtual: number;
    loaiDaiDien: string;
    stt: number;
}