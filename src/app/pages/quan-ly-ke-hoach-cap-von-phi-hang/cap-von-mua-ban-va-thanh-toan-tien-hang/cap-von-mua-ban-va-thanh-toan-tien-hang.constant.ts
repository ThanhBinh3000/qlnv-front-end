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