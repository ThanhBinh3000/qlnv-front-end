import { FileDinhKem } from "./FileDinhKem"

export class KeHoachBanDauGia {
    capDv: string;
    diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan>;
    fileDinhKems: Array<FileDinhKem>;
    id: number;
    khoanTienDatTruoc: number;
    loaiVthh: string;
    loaiHopDong: string;
    cloaiVthh: string;
    maDv: string;
    namKeHoach: number;
    ngayKy: string;
    ngayLapKeHoach: string;
    phanLoTaiSanList: Array<PhanLoTaiSan>;
    phuongThucGiaoNhan: string;
    phuongThucThanhToan: string;
    qdGiaoChiTieuId: number;
    qdGiaoChiTieuNam: string;
    soQuyetDinhGiaoChiTieu: string;
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
    moTaHangHoa: string;
    tenQdGiaoChiTieu: string;
    thoiGianDuKien: string;
    ghiChu: string;
    tenTrangThai: string;
    loaiHangHoa: string;
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
    chungLoaiHh: string;
    donGia: number;
    donViTinh: string;
    giaKhoiDiem: number;
    id: number;
    maChiCuc: string;
    maDiemKho: string;
    maDvTaiSan: string;
    maLoKho: string;
    maNganKho: string;
    maNhaKho: string;
    soLuong: number;
    soTienDatTruoc: number;
    stt: number;
    tenChiCuc: string;
    tenDiemKho: string;
    tenLoKho: string;
    tenNganKho: string;
    tenNhaKho: string;
    tonKho: string;
}
export class DiaDiemGiaoNhan {
    bhDgKehoachId: number;
    diaChi: string;
    id: number;
    soLuong: number;
    stt: number;
    tenChiCuc: string;
}

export class DanhSachPhanLo {
    id: number;
    maDvi: string;
    tenDvi: string;
    maDiemKho: string;
    diaDiemKho: string;
    tenDiemKho: string;
    maNhaKho: string;
    tenNhakho: string;
    maNganKho: string;
    tenNganKho: string;
    maLoKho: string;
    tenLoKho: string;
    loaiVthh: string;
    tenLoaiVthh: string;
    cloaiVthh: string;
    dviTinh: string;
    tenCloaiVthh: string;
    maDviTsan: string;
    soLuong: number;
    donViTinh: string;
    giaKhongVat: number;
    giaKhoiDiem: number;
    duDau: number;
    tienDatTruoc: number;
    soLuongChiTieu: number;
    soLuongKh: number;
    idVirtual?: number;
    isEdit: boolean;
    children?: DanhSachPhanLo[];
    level?: number;
    expand?: boolean;
    parent?: DanhSachPhanLo;
}
