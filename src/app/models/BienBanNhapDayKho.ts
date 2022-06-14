import { FileDinhKem } from "./FileDinhKem";

export class BienBanNhapDayKho {
    id: number;
    keToan: string;
    kyThuatVien: string;
    maDiemKho: string;
    maDonVi: string;
    maHang: string;
    maNganLo: string;
    maNhaKho: string;
    maQhns: string;
    nganLoId: number;
    ngayBatDauNhap: string;
    ngayKetThucNhap: string;
    ngayLap: string;
    ngayNhapDayKho: string;
    nhaKhoId: number;
    qdgnvnxId: number;
    soBienBan: string;
    tenDiemKho: string;
    tenHang: string;
    tenNganLo: string;
    tenNhaKho: string;
    thuKho: string;
    thuTruong: string;
    chungLoaiHh: string;
    chungLoaiHangHoa: string;
    diemKhoId: number;
    fileDinhKems: Array<FileDinhKem>;
    chiTiets: Array<DetailBienBanNhapDayKho>;
    tenTrangThai: string;
    trangThaiDuyet: string;
    trangThai: string;
    tinhTrang: string;
    tenDonVi: string;
    soQd: string;
    constructor(chiTiets: Array<DetailBienBanNhapDayKho> = []) {
        this.chiTiets = chiTiets;
    }
}
export class DetailBienBanNhapDayKho {
    donGia: number;
    ghiChu: string;
    id: number;
    stt: number;
    soLuong: number;
    thanhTien: number;
    isEdit: boolean;
}