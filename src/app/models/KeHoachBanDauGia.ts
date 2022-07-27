import { FileDinhKem } from "./FileDinhKem"

export class KeHoachBanDauGia {
    capDv: string;
    diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan>;
    fileDinhKems: Array<FileDinhKem>;
    id: number;
    khoanTienDatTruoc: number;
    loaiHangHoa: string;
    loaiHopDong: string;
    loaiVatTuHangHoa: string;
    maDv: string;
    namKeHoach: number;
    ngayKy: string;
    ngayLapKeHoach: string;
    phanLoTaiSanList: Array<PhanLoTaiSan>;
    phuongThucGiaoNhan: string;
    phuongThucThanhToan: string;
    qdGiaoChiTieuId: number;
    qdGiaoChiTieuNam: string;
    soKeHoach: string;
    soLuong: number;
    tgDkTcDenNgay: string;
    tgDkTcTuNgay: string;
    thoiGianKyHd: string;
    thoiGianKyHopDongGhiChu: string;
    thoiHanGiaoNhan: number;
    thoiHanGiaoNhanGhiChu: string;
    thoiHanThanhToan: string;
    thoiHanThanhToanGhiChu: string;
    thongBaoKhBdg: string;
    tieuChuanChatLuong: string;
    trangThai: string;
    trichYeu: string;
    tenQdGiaoChiTieu: string;
    thoiGianDuKien: string;
    ghiChu: string;
    tenTrangThai: string;
    constructor(
        diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [],
        phanLoTaiSanList: Array<PhanLoTaiSan> = [],
        fileDinhKems: Array<FileDinhKem> = []) {
        this.diaDiemGiaoNhanList = diaDiemGiaoNhanList;
        this.phanLoTaiSanList = phanLoTaiSanList;
        this.fileDinhKems = fileDinhKems;
    }
}

export class PhanLoTaiSan {
    bhDgKehoachId: number;
    chiCuc: string;
    chungLoaiHh: string;
    diemKho: string;
    donGia: number;
    donViTinh: string;
    giaKhoiDiem: number;
    id: number;
    loKho: string;
    maDvTaiSan: string;
    nganKho: string;
    soLuong: number;
    soTienDatTruoc: number;
    stt: number;
    tonKho: number;
}
export class DiaDiemGiaoNhan {
    bhDgKehoachId: number;
    diaChi: string;
    id: number;
    soLuong: number;
    stt: number;
    tenChiCuc: string;
}