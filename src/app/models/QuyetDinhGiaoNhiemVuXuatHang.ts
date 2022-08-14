import { FileDinhKem } from "./FileDinhKem";

export class QuyetDinhGiaoNhiemVuXuatHang {
    cts: Array<Cts>;
    fileDinhKems: Array<FileDinhKem>;
    hopDongIds: Array<number>;
    id: number;
    loaiVthh: string;
    namXuat: number;
    ngayQuyetDinh: string;
    soQuyetDinh: string;
    trichYeu: string;
    donVi: string;
    maDonVi: string;
    tenDvi: string;
    maDvi: string;
    soHopDong: string;
    trangThai: string;
    tenTrangThai: string;
    constructor(fileDinhKems: Array<FileDinhKem> = [], hopDongIds: Array<number> = [], cts: Array<Cts> = []) {
        this.fileDinhKems = fileDinhKems;
        this.hopDongIds = hopDongIds;
        this.cts = cts;
    }
}

export class Cts {
    donGiaKhongThue: number;
    donViTinh: string;
    id: number;
    maDiemKho: string;
    maDvi: string;
    maNganKho: string;
    maNganLo: string;
    maNhaKho: string;
    maVatTu: string;
    maVatTuCha: string;
    qdgnvxId: number;
    soLuong: number;
    stt: number;
    thanhTien: number;
    thoiHanXuatBan: string;

}