import { FileDinhKem } from "./FileDinhKem";

export class QuyetDinhNhapXuat {
    id: number;
    ghiChu: string;
    ldoTuchoi: string;
    loaiQd: string;
    maDvi: string;
    tenDvi: string;
    ngayHluc: string;
    ngayKy: string;
    ngayQdinh: string;
    soHd: string;
    soQd: string;
    veViec: string;
    trichYeu: string;
    loaiVthh: string;
    fileDinhKems: Array<FileDinhKem>;
    detail: Array<DetailQuyetDinhNhapXuat>;
    tenDonVi: string;
    trangThai: string;
    tenTrangThai: string;
    hopDongId: number;
    namNhap: number;
    hopDongIds: Array<number>;
    constructor(
        fileDinhKemReqs: Array<FileDinhKem> = [],
        details: Array<DetailQuyetDinhNhapXuat> = [],
        hopDongIds: Array<number> = []
    ) {
        this.fileDinhKems = fileDinhKemReqs;
        this.detail = details;
        this.hopDongIds = hopDongIds;
    }
}
export class DetailQuyetDinhNhapXuat {
    denNgayThien: string;
    donViTinh: string;
    id: number;
    idHdr: number;
    loaiNx: string;
    maDvi: string;
    tenDonVi: string;
    tenDvi: string;
    maVthh: string;
    soLuong: number;
    tenVthh: string;
    tuNgayThien: string;
    thoiGianNhapKhoMuonNhat: string;
    isEdit: boolean;
    stt: number;
    chungLoaiHh: string;
}

export class ThongTinDiaDiemNhap {
    maDvi: string;
    tenDvi: string;
    maCuc: string;
    tenCuc: string;
    maChiCuc: string;
    tenChiCuc: string;
    maDiemKho: string;
    tenDiemKho: string;
    maNhaKho: string;
    tenNhaKho: string;
    maNganKho: string;
    tenNganKho: string;
    maLoKho: string;
    tenLoKho: string;
    soLuong: number;
    soLuongDiemKho: number;
    soLuongGiao: number;
    soLuongPhanBo: number;
  slTon: number;
}
