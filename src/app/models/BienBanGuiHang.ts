export class BienBanGuiHang {

    benGiao: string;
    benNhan: string;
    capDvi: string;
    chatLuong: string;
    donViCungCap: string;
    donViTinh: string;
    ghiChu: string;
    hopDongId: number;
    id: number;
    loaiVthh: string;
    lyDoTuChoi: string;
    maDvi: string;
    maVatTu: string;
    maVatTuCha: string;
    ngayGui: string;
    ngayHopDong: string;
    phieuNkTgId: number;
    qdgnvnxId: number;
    soBienBan: string;
    soLuong: number;
    thoiGian: string;
    tinhTrang: string;
    trachNhiemBenGiao: string;
    trachNhiemBenNhan: string;
    trangThai: string;
    chiTiets: Array<ChiTiet>;
    constructor(chiTiets: Array<ChiTiet> = []) {
        this.chiTiets = chiTiets;
    }
}

export class ChiTiet {
    bienBanGuiHangId: number;
    chucVu: string;
    daiDien: string;
    id: number;
    loaiBen: string;
    stt: string;
}