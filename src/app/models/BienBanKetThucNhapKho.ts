import { FileDinhKem } from "./FileDinhKem"

export class BienBanKetThucNhapKho {
    id: number;
    keToanDonVi: string;
    kyThuatVien: string;
    lyDoTuChoi: string;
    maDiemKho: string;
    maDvi: string;
    maNganKho: string;
    maNganLo: string;
    maNhaKho: string;
    maVatTu: string;
    maVatTuCha: string;
    nam: number;
    ngayBatDauNhap: string;
    ngayKetThucKho: string;
    ngayKetThucNhap: string;
    qdgnvnxId: number;
    so: number;
    soBienBan: string;
    thuKho: string;
    thuTruongDonVi: string;
    trangThai: string;
    bbChuanBiKhoId: number;
    capDvi: string;
    fileDinhKemReqs: Array<FileDinhKem>;
    chiTiets: Array<chiTietBienBanKetThucNhapKho>;
    tenDvi: string;
    chungLoaiHangHoa: string;
    tenHang: string;
    tenTrangThai: string;
    soHdId: number;
    constructor(fileDinhKemReqs: Array<FileDinhKem> = [], chiTiets: Array<chiTietBienBanKetThucNhapKho> = []) {
        this.fileDinhKemReqs = fileDinhKemReqs;
        this.chiTiets = chiTiets;
    }
}

export class chiTietBienBanKetThucNhapKho {
    bbKtNhapKhoId: number;
    donGia: number;
    ghiChu: string;
    id: number;
    soLuong: number;
    stt: number;
    thanhTien: number;
}