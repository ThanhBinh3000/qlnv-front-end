import { Operator, Status, Utils } from "src/app/Utility/utils";

export class Cvmb {
    static readonly GHI_NHAN_CU_VON = '1';
    static readonly CU_VON_DVCD = '2';
    static readonly THANH_TOAN = '3';
    static readonly TIEN_THUA = '4';
    static readonly VON_BAN = '5';
    static readonly HOP_DONG_VON_BAN = '6';
    static readonly QUAN_LY_THU_CHI = '7';

    static readonly THOC = "0";
    static readonly GAO = "1";
    static readonly MUOI = "2";
    static readonly VTU = "3";

    static readonly HOP_DONG = "0";
    static readonly DON_GIA = "1";

    static readonly LOAI_DE_NGHI = [
        {
            id: Cvmb.GAO,
            tenDm: "Gạo",
        },
        {
            id: Cvmb.THOC,
            tenDm: "Thóc",
        },
        {
            id: Cvmb.MUOI,
            tenDm: "Muối",
        },
        {
            id: Cvmb.VTU,
            tenDm: "Vật tư",
        },
    ];

    static suggestionName(id: string) {
        return Cvmb.LOAI_DE_NGHI.find(e => e.id == id).tenDm;
    }

    static readonly CAN_CU_GIA = [
        {
            id: Cvmb.HOP_DONG,
            tenDm: "Hợp đồng trúng thầu",
        },
        {
            id: Cvmb.DON_GIA,
            tenDm: "Quyết định đơn giá",
        }
    ]

    static priceBasisName(id: string) {
        return Cvmb.CAN_CU_GIA.find(e => e.id == id).tenDm;
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

    constructor(data: Partial<Pick<CapUng, keyof CapUng>>) {
        Object.assign(this, data);
    }

    changeModel(data: CapUng) {
        this.uncCong = Operator.sum([this.uncVonUng, this.uncVonCap]);
        this.lkVonUng = Operator.sum([data.lkVonUng, this.uncVonUng, -data.uncVonUng]);
        this.lkVonCap = Operator.sum([data.lkVonCap, this.uncVonCap, -data.uncVonCap]);
        this.lkCong = Operator.sum([this.lkVonUng, this.lkVonCap]);
    }

    upperBound() {
        return this.lkCong > Utils.MONEY_LIMIT;
    }

    clear() {
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'number') {
                this[key] = null;
            }
        })
    }

    sum(data: CapUng) {
        Object.keys(data).forEach(key => {
            if (typeof this[key] == 'number' || typeof data[key] == 'number') {
                this[key] = Operator.sum([this[key], data[key]]);
            }
        })
    }

    request() {
        const temp = Object.assign({}, this);
        if (this.id?.length == 38) {
            temp.id = null;
        }
        return temp;
    }
}

export class ThanhToan {
    id: string;
    idCapDuoi: string;
    stt: string;
    level: number;
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
    congVan: string;
    ghiChu: string;

    constructor(data: Partial<Pick<ThanhToan, keyof ThanhToan>>) {
        Object.assign(this, data);
    }

    changeModel(is: boolean, data?: ThanhToan) {
        this.gtKeHoach = Operator.mul(this.slKeHoach, this.donGia);
        this.gtHopDong = Operator.mul(this.slHopDong, this.donGia);
        this.gtThucHien = Operator.mul(this.slThucHien, this.donGia);
        this.cong = Operator.sum([this.ung, this.cap]);
        if (data) {
            this.lkUng = Operator.sum([data.lkUng, this.ung, -data.ung]);
            this.lkCap = Operator.sum([data.lkCap, this.cap, -data.cap]);
            this.lkCong = Operator.sum([this.lkUng, this.lkCap]);
        }
        this.soConDcTt = is ? Operator.sum([this.gtThucHien, -this.lkCong, -this.phatViPham]) : Operator.sum([this.gtKeHoach, -this.lkCong]);
        this.lkSauLanNay = Operator.sum([this.lkCong, this.cong]);
        this.soConPhaiNop = is ? Operator.sum([this.gtThucHien, -this.lkSauLanNay, -this.phatViPham]) : Operator.sum([this.gtHopDong, -this.lkSauLanNay]);
    }

    upperBound() {
        return this.gtKeHoach > Utils.MONEY_LIMIT || this.gtHopDong > Utils.MONEY_LIMIT || this.gtThucHien > Utils.MONEY_LIMIT || this.lkCong > Utils.MONEY_LIMIT || this.lkSauLanNay > Utils.MONEY_LIMIT;
    }

    clear() {
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'number' && key != 'dot' && key != 'level') {
                this[key] = null;
            }
        })
    }

    sum(data: ThanhToan) {
        Object.keys(data).forEach(key => {
            if ((key != 'dot' && key != 'level') && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
                this[key] = Operator.sum([this[key], data[key]]);
            }
        })
    }

    request() {
        const temp = Object.assign({}, this);
        if (this.id?.length == 38) {
            temp.id = null;
        }
        return temp;
    }
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

    constructor(data: Partial<Pick<TienThua, keyof TienThua>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.nopTong = Operator.sum([this.nopVonUng, this.nopVonCap]);
        this.lkSauLanNay = Operator.sum([this.daNopTong, this.nopTong]);
        this.soConPhaiNop = Operator.sum([this.duTong, -this.lkSauLanNay]);
    }

    upperBound() {
        return this.lkSauLanNay > Utils.MONEY_LIMIT;
    }

    request() {
        const temp = Object.assign({}, this);
        if (this.id?.length == 38) {
            temp.id = null;
        }
        return temp;
    }
}

export class Report {
    id: string;
    maDvi: string;
    maDviCha: string;
    maCapUng: string;
    namDnghi: number;
    loaiDnghi: string;
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
    trangThai: string = Status.TT_01;
    ngayTrinhDvct: string;
    ngayDuyetDvct: string;
    ngayPheDuyetDvct: string;
    trangThaiDvct: string = Status.TT_01;
    trangThaiThop: string;
    maDviTien: string;
    lyDoTuChoi: string;
    thuyetMinh: string;
    ngayNhanLenhChuyenCo: string;
    tkNhan: string;
    lstFiles: any[] = [];
    lstCtiets: any[] = [];
    fileDinhKems: any[] = [];
    listIdDeleteFiles: string[] = [];
}

export class Perm {
    create!: string;
    edit!: string;
    delete!: string;
    pass!: string;
    approve!: string;
    accept!: string;
}

export class Pagging {
    limit: number = 10;
    page: number = 1;
}

export class Search {
    loaiTimKiem: string = '0';
    maLoai: string;
    dot: number;
    maCapUng: string;
    maDvi: string;
    loaiDnghi: string;
    namDnghi: number;
    canCuVeGia: string;
    ngayTaoDen: any;
    ngayTaoTu: any;
    paggingReq: Pagging = new Pagging();
    trangThai: string = Status.TT_01;
    trangThaiDvct: string;

    request() {
        return {
            loaiTimKiem: this.loaiTimKiem,
            maLoai: this.maLoai,
            dot: this.dot,
            maCapUng: this.maCapUng,
            maDvi: this.maDvi,
            loaiDnghi: this.loaiDnghi,
            namDnghi: this.namDnghi,
            canCuVeGia: this.canCuVeGia,
            ngayTaoTu: this.ngayTaoTu ? Utils.fmtDate(this.ngayTaoTu) : null,
            ngayTaoDen: this.ngayTaoDen ? Utils.fmtDate(this.ngayTaoDen) : null,
            paggingReq: this.paggingReq,
            trangThai: this.trangThai,
            trangThaiDvct: this.trangThaiDvct,
        }
    }

    clear() {
        this.dot = null;
        this.maCapUng = null;
        this.loaiDnghi = null;
        this.namDnghi = null;
        this.canCuVeGia = null;
        this.ngayTaoTu = null;
        this.ngayTaoDen = null;
        this.trangThai = null;
        this.trangThaiDvct = null;
    }
}