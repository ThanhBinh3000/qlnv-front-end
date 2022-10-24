import { FileDinhKem } from "./FileDinhKem"

export class QuyetDinhPheDuyetKeHoachBanDauGia {
    chiTietList: Array<ChiTietList>;
    capDonVi: string;
    fileDinhKems: Array<FileDinhKem>;
    id: number;
    loaiVthh: string;
    cloaiVthh: string;
    lyDoTuChoi: string;
    maDonVi: string;
    maVatTu: string;
    tenVthh:string;
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

    constructor(fileDinhKems: Array<FileDinhKem> = [], chiTietList: Array<ChiTietList> = []) {
        this.fileDinhKems = fileDinhKems;
        this.chiTietList = chiTietList;
    }
}

export class ThongTinTaiSan {
    bhDgKehoachId: number;
    chungLoaiHh: string;
    donGia: number;
    donViTinh: string;
    ghiChu: string;
    giaKhoiDiem: number;
    id: number;
    maChiCuc: string;
    maDiemKho: string;
    maDvTaiSan: string;
    maLoKho: string;
    maNganKho: string;
    maNhaKho: string;
    qdPheDuyetKhbdgChiTietId: number;
    soLuong: number;
    soTienDatTruoc: number;
    stt: number;
    tenChiCuc: string;
    tenDiemKho: string;
    tenLoKho: string;
    tenNganKho: string;
    tenNhaKho: string;
    tonKho: number;
}
export class ChiTietList {
    bhDgKeHoachId: number;
    id: number;
    quyetDinhPheDuyetId: number;
    thongTinTaiSans: Array<ThongTinTaiSan>;
    constructor(thongTinTaiSans: Array<ThongTinTaiSan> = []) {
        this.thongTinTaiSans = thongTinTaiSans;
    }
}
