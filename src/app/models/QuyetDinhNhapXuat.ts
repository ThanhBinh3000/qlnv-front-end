import { FileDinhKem } from "./FileDinhKem";

export class QuyetDinhNhapXuat {
    id: number;
    ghiChu: string;
    ldoTuchoi: string;
    loaiQd: string;
    maDvi: string;
    ngayHluc: string;
    ngayKy: string;
    soHd: string;
    soQd: string;
    veViec: string;
    fileDinhKems: Array<FileDinhKem>;
    detail: Array<DetailQuyetDinhNhapXuat>;
    tenDonVi: string;
    trangThai: string;
    hopDongId: number;
    constructor(
        fileDinhKemReqs: Array<FileDinhKem> = [],
        details: Array<DetailQuyetDinhNhapXuat> = []
    ) {
        this.fileDinhKems = fileDinhKemReqs;
        this.detail = details;
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
    maVthh: string;
    soLuong: number;
    tenVthh: string;
    tuNgayThien: string;
    thoiGianNhapKhoMuonNhat: string;
    isEdit: boolean;
    stt: number;
}