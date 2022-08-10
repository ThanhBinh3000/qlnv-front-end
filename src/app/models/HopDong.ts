import { FileDinhKem } from 'src/app/models/FileDinhKem';
export class HopDong {
    canCu: string;
    chucVu: string;
    cloaiVthh: string;
    denNgayHluc: string;
    denNgayTdo: string;
    detail: Array<Detail>;
    detail1: Array<Detail1>;
    diaDiemNhapKhoReq: Array<DiaDiemNhapKhoReq>;
    diaChi: string;
    donGiaVat: number;
    fileDinhKems: Array<FileDinhKem>;
    ghiChu: string;
    gtriHdSauVat: number;
    gtriHdTrcVat: number;
    id: number;
    idGoiThau: string;
    idNthau: string;
    ldoTuchoi: string;
    loaiHd: string;
    loaiVthh: string;
    maDvi: string;
    mst: string;
    namKh: number;
    ngayKy: string;
    nuocSxuat: string;
    sdt: string;
    soHd: string;
    soLuong: number;
    soNgayTdo: number;
    soNgayThien: number;
    stk: string;
    tenHd: string;
    tenNguoiDdien: string;
    tgianNkho: string;
    tieuChuanCl: string;
    tuNgayHluc: string;
    tuNgayTdo: string;
    vat: number;
}

export class DiaDiemNhapKhoReq {
    donGia: number;
    id: number;
    idHdr: number;
    maDiemKho: string;
    maDvi: string;
    nhaKho: string;
    soLuong: number;
}
export class Detail1 {
    chucVu: string;
    diaChi: string;
    id: number;
    idHdr: number;
    ma: string;
    mst: string;
    sdt: string;
    stk: string;
    ten: string;
    tenNguoiDdien: string;
    type: string;
}
export class Detail {
    donGia: number;
    giaSauVat: number;
    giaTruocVat: number;
    id: number;
    idHdr: number;
    shgt: string;
    soLuong: number; F
    tenGthau: string;
    vat: number;
    detail: Array<DiaDiemNhapKhoReq>;
}
