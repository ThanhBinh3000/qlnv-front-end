
export class Const {
    static readonly GHI_NHAN_CU_VON = '1';
    static readonly CU_VON_DVCD = '2';
    static readonly THANH_TOAN = '3';
    static readonly TIEN_THUA = '4';
    static readonly VON_BAN = '5';
    static readonly TONG_HOP_VON_BAN = '6';
    static readonly HOP_DONG_VON_BAN = '7';
    static readonly QUAN_LY_THU_CHI = '8';

    static readonly THOC = "0";
    static readonly GAO = "1";
    static readonly MUOI = "2";
    static readonly VTU = "3";

    static readonly HOP_DONG = "0";
    static readonly DON_GIA = "1";

    static readonly LOAI_DE_NGHI = [
        {
            id: Const.GAO,
            tenDm: "Gạo",
        },
        {
            id: Const.THOC,
            tenDm: "Thóc",
        },
        {
            id: Const.MUOI,
            tenDm: "Muối",
        },
        {
            id: Const.VTU,
            tenDm: "Vật tư",
        },
    ];

    static suggestionName(id: string) {
        return Const.LOAI_DE_NGHI.find(e => e.id == id).tenDm;
    }

    static readonly CAN_CU_GIA = [
        {
            id: Const.HOP_DONG,
            tenDm: "Hợp đồng trúng thầu",
        },
        {
            id: Const.DON_GIA,
            tenDm: "Quyết định đơn giá",
        }
    ]

    static priceBasisName(id: string) {
        return Const.CAN_CU_GIA.find(e => e.id == id).tenDm;
    }
}

export class BtnStatus {
    general: boolean = true;                           //trang thai tong cua ban ghi dang xet
    save?: boolean = true;                             // trang thai cua nut luu
    submit?: boolean = true;                           // trang thai cua nut trinh duyet
    pass?: boolean = true;                             // trang thai cua nut duyet, tu choi duyet
    approve?: boolean = true;                          // trang thai cua nut phe duyet, tu choi phe duyet
    accept?: boolean = true;                           // trang thai cua nut tiep nhan, tu choi tiep nhan
}

export class CapUng {
    id: string;
    stt: string;
    maDvi: string;
    tenDvi: string;
    soLenhChiTien: string;
    ngayLap: string;
    noiDung: string;
    nienDoNs: string;
    tuTk: string;
    uncVonUng: number;
    uncVonCap: number;
    uncCong: number;
    lkVonUng: number;
    lkVonCap: number;
    lkCong: number;
    ghiChu: string;
}

export class ThanhToan {
    id: string;
    stt: string;
    tenKhachHang: string;
    qdPheDuyet: string;
    maDvi: string;
    tenDvi: string;
    slKeHoach: number;
    slHopDong: number;
    slThucHien: number;
    donGia: number;
    gtKeHoach: number;
    gtHopDong: number;
    gtThucHien: number;
    phatViPham: number;
    tlSoluong: number;
    tlThanhTien: number;
    lkUng: number;
    lkCap: number;
    lkCong: number;
    soConDcTt: number;
    soDuyetTt: number;
    uncNgay: string;
    uncNienDoNs: string;
    ung: number;
    cap: number;
    cong: number;
    lkSauLanNay: number;
    soConPhaiNop: number;
    dot: number;
    congVan: any;
    ghiChu: string;
}

export class TienThua {
    id: string;
    stt: string;
    maHangDtqg: string;
    tenHangDtqg: string;
    nhanVonUng: number;
    nhanVonCap: number;
    nhanTong: number;
    giaoCapUng: number;
    giaoCapVon: number;
    giaoTong: number;
    ttVonUng: number;
    ttVonCap: number;
    ttTong: number;
    duVonUng: number;
    duVonCap: number;
    duTong: number;
    daNopVonUng: number;
    daNopVonCap: number;
    daNopTong: number;
    nopUncNgay: string;
    nopVonUng: number;
    nopVonCap: number;
    nopTong: number;
    lkSauLanNay: number;
    soConPhaiNop: number;
    ghiChu: string;
}

export class Report {
    id: string;
    maDvi: string;
    maDviCha: string;
    maCapUng: string;
    namDnghi: number;
    loaiDeNghi: string;
    canCuVeGia: string;
    quyetDinh: string;
    maLoai: string;
    dot: number;
    ngayTao: any;
    nguoiTao: string;
    ngayTrinh: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    ngayTraKq: string;
    trangThai: string;
    trangThaiThop: string;
    maDviTien: string;
    lyDoTuChoi: string;
    thuyetMinh: string;
    ngayNhanLenhChuyenCo: string;
    tkNhan: string;
    lstFiles: any[];
    lstCtiets: any[];
    fileDinhKems: any[];
    listIdDeleteFiles: string[];
}

export class Perm {
    create!: string;
    edit!: string;
    delete!: string;
    pass!: string;
    approve!: string;
    accept!: string;
}
