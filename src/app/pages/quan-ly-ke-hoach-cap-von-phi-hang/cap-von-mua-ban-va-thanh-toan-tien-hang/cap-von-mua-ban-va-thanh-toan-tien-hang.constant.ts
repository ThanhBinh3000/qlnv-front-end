import { NzUploadFile } from "ng-zorro-antd/upload";
import { StringLiteral } from "typescript";

export const TRANG_THAI = [
    {
        id: "1",
        tenDm: 'Đang soạn'
    },
    {
        id: "2",
        tenDm: 'Trình duyệt'
    },
    {
        id: "3",
        tenDm: 'Từ chối duyệt'
    },
    {
        id: "4",
        tenDm: 'Duyệt'
    },
    {
        id: "5",
        tenDm: 'Từ chối phê duyệt'
    },
    {
        id: "7",
        tenDm: 'Phê duyệt'
    },
]

export class Report {
    id: string;
    maDvi: string;
    maDviCha: string;
    maCapUng: string;
    namDnghi: string;
    loaiDnghi: string;
    canCuVeGia: string;
    ngayTao: Date;
    nguoiTao: string;
    dot: number;
    ttGui: sendInfo;
    ttNhan: receivedInfo;
    maLoai: number;
}

export class sendInfo {
    trangThai: string;
    ngayTrinh: Date;
    ngayDuyet: Date;
    ngayPheDuyet: Date;
    lyDoTuChoi: string;
    thuyetMinh: string;
    lstFiles: any[];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    fileDinhKems: any[];
    listIdDeleteFiles: string[];
    ngayNhanLenhChuyenCo: Date;
    tkNhan: string;
    lstCtietBcaos: any[];
}

export class receivedInfo {
    trangThai: string;
    ngayTrinh: Date;
    ngayDuyet: Date;
    ngayPheDuyet: Date;
    lyDoTuChoi: string;
    thuyetMinh: string;
    lstFiles: any[];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    fileDinhKems: any[];
    listIdDeleteFiles: string[];
    ngayNhanLenhChuyenCo: Date;
    tkNhan: string;
    lstCtietBcaos: reInfo[];
}

export class reInfo {
    dot: number;
    ngayNhanLenhChuyenCo: Date;
    tkNhan: string;
}

export class CapUng {
    id: string;
    soLenhChiTien: string;
    ngayLapLenh: Date;
    noiDung: string;
    maNguonNs: string;
    nienDoNs: string;
    maChuong: string;
    maNganhKt: string;
    maNdtk: string;
    tuTk: string;
    vonUng: number;
    vonCap: number;
    tong: number;
    luyKeVonUng: number;
    luyKeVonCap: number;
    luyKeTong: number;
    maDvi: string;
    tenDvi: string;
    ghiChu: string;
    listGhiNhanVonLuyKe: LuyKeCapUng[];
}

export class LuyKeCapUng {
    id: string;
    vonUng: number;
    vonCap: number;
    tong: number;
    dot: number;
}

export class ThanhToan {
    id: string;
    maDvi: string;
    tenDvi: string;
    isParent: boolean;
    tenKhachHang: string;
    qdPdKqNhaThau: string;
    soLuongKeHoach: number;
    soLuongHopDong: number;
    soLuongThucHien: number;
    donGia: number;
    giaTriHd: number;
    giaTriTh: number;
    soTtLuyKe: number;
    soConDuocTt: number;
    soDuyetTtLanNay: number;
    uyNhiemChiNgay: Date;
    uyNhiemChiMaNguonNs: string;
    uyNhiemChiNienDoNs: string;
    uyNhiemChiSoTien: number;
    tongDaTt: number;
    soConDuocTtSauLanNay: number;
    soLuong: number;
    luyKeCapUng: number;
    luyKeCapVon: number;
    luyKeTong: number;
    uyNhiemChiCapUng: number;
    uyNhiemChiCapVon: number;
    uyNhiemChiTong: number;
    listTTCNLuyKe: LuyKeThanhToan[];
}

export class LuyKeThanhToan {
    id: string;
    capUng: number;
    capVon: number;
    tong: number;
    uyNhiemChiNgay: Date;
    uyNhiemChiMaNguonNs: number;
    uyNhiemChiNienDoNs: number;
    uyNhiemChiCapUng: number;
    uyNhiemChiCapVon: number;
    uyNhiemChiTong: number;
    soNopLanNay: number;
    dot: number;
}

export class TienThua {
    id: string;
    maHang: string;
    hangDtqg: string;
    tongVonUngNhan: number;
    tongVonCapNhan: number;
    tongVonNhan: number;
    tongCapUngGiao: number;
    tongCapVonGiao: number;
    tongCapGiao: number;
    tongVonUngTt: number;
    tongVonCapTt: number;
    tongVonTt: number;
    tongVonUngDu: number;
    tongVonCapDu: number;
    tongVonDu: number;
    soDaNopTcLuyKeLanNay: number;
    uyNhiemChiNgay: Date;
    soNopLanNay: number;
    luyKeSauLanNop: number;
    soConPhaiNop: number;
    listLuyKeTienThua: luyKeTienThua[];
}

export class luyKeTienThua {
    id: string;
    uyNhiemChiNgay: Date;
    soNopLanNay: number;
    dot: number;
}