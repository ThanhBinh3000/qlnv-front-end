import { Roles, Status, Utils } from "src/app/Utility/utils";

export class Cvnc {
    static readonly DS_CAP_VON = 'ds-cap-von';
    static readonly DS_DN_CAP_VON = 'ds-dn-cap-von';
    static readonly DS_DN_CV_DVCD = 'ds-dn-cap-von-dvcd';
    static readonly CV_DON_GIA = 'cv-don-gia';
    static readonly CV_HOP_DONG = 'cv-hop-dong';
    static readonly DN_DON_GIA = 'dn-don-gia';
    static readonly DN_HOP_DONG = 'dn-hop-dong';
    static readonly TAB_LIST = [
        {
            name: 'Cấp vốn',
            code: Cvnc.DS_CAP_VON,
            status: true,
            role: Roles.CVNC.VIEW_CV,
            isSelected: false,
        },
        {
            name: 'Đề nghị cấp vốn',
            code: Cvnc.DS_DN_CAP_VON,
            status: true,
            role: Roles.CVNC.VIEW_DN,
            isSelected: false,
        },
        {
            name: 'Đề nghị cấp vốn từ đơn vị cấp dưới',
            code: Cvnc.DS_DN_CV_DVCD,
            status: true,
            role: Roles.CVNC.ACCEPT_DN,
            isSelected: false,
        },
    ]

    static readonly CAP_VON = '0';
    static readonly DE_NGHI = '1';

    static readonly THOC = "0";
    static readonly GAO = "1";
    static readonly MUOI = "2";
    static readonly VTU = "3";

    static readonly HOP_DONG = "0";
    static readonly DON_GIA = "1";

    static readonly LOAI_DE_NGHI = [
        {
            id: Cvnc.GAO,
            tenDm: "Gạo",
        },
        {
            id: Cvnc.THOC,
            tenDm: "Thóc",
        },
        {
            id: Cvnc.MUOI,
            tenDm: "Muối",
        },
        {
            id: Cvnc.VTU,
            tenDm: "Vật tư",
        },
    ];

    static suggestionName(id: string) {
        return Cvnc.LOAI_DE_NGHI.find(e => e.id == id).tenDm;
    }

    static readonly CAN_CU_GIA = [
        {
            id: Cvnc.HOP_DONG,
            tenDm: "Hợp đồng trúng thầu",
        },
        {
            id: Cvnc.DON_GIA,
            tenDm: "Quyết định đơn giá",
        }
    ]

    static priceBasisName(id: string) {
        return Cvnc.CAN_CU_GIA.find(e => e.id == id).tenDm;
    }
}

export class BtnStatus {
    general: boolean = true;                           //trang thai tong cua ban ghi dang xet
    save?: boolean = true;                             // trang thai cua nut luu
    submit?: boolean = true;                           // trang thai cua nut trinh duyet
    pass?: boolean = true;                             // trang thai cua nut duyet, tu choi duyet
    approve?: boolean = true;                          // trang thai cua nut phe duyet, tu choi phe duyet
    accept?: boolean = true;                           // trang thai cua nut tiep nhan, tu choi tiep nhan
    export?: boolean = true;
}

export class Doc {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

export class Report {
    id: string;
    maDvi: string;
    maDviCha: string;
    maDnghi: string;
    namDnghi: number;
    soQdChiTieu: string;
    loaiDnghi: string;
    canCuVeGia: string;
    congVan: Doc;
    ngayCongVan: string;
    maLoai: string;
    soLan: number;
    ngayTao: any;
    nguoiTao: string;
    ngayTrinh: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    ngayTraKq: string;
    trangThai: string = Status.TT_01;
    trangThaiThop: string;
    maDviTien: string = '1';
    lyDoTuChoi: string;
    thuyetMinh: string;
    lstFiles: any[] = [];
    lstCtiets: any[] = [];
    fileDinhKems: any[] = [];
    listIdDeleteFiles: string[] = [];
}

export class CapVon {
    id: string;
    stt: string;
    level: number;
    idCapDuoi: string;
    maDvi: string;
    tenDvi: string;
    tenKhachHang: string;
    qdPheDuyet: string;
    slKeHoach: number;
    slHopDong: number;
    slThucHien: number;
    donGia: number;
    gtHopDong: number;
    gtThucHien: number;
    phatViPham: number;
    tlSoluong: number;
    tlThanhTien: number;
    congVan: string;
    dtoanDaGiao: number;
    lkUng: number;
    lkCap: number;
    lkCong: number;
    tongVonVaDtoanDaCap: number;
    vonDnCapLanNay: number;
    ung: number;
    cap: number;
    cong: number;
    uncNgay: string;
    uncNienDo: string;
    tongTien: number;
    soConDuocCap: number;
    soLan: number;
    ghiChu: string;

    constructor(data: Partial<Pick<CapVon, keyof CapVon>>) {
        Object.assign(this, data);
    }

    upperBound() {
        return this.gtHopDong > Utils.MONEY_LIMIT || this.gtThucHien > Utils.MONEY_LIMIT || this.lkCong > Utils.MONEY_LIMIT || this.tongTien > Utils.MONEY_LIMIT;
    }

    request() {
        const temp = Object.assign({}, this);
        if (this.id?.length == 38) {
            temp.id = null;
        }
        return temp;
    }
}

export class Pagging {
    limit: number = 10;
    page: number = 1;
}

export class Search {
    loaiTimKiem: string = '0';
    maLoai: string;
    soLan: number;
    maDnghi: string;
    maDvi: string;
    soQdChiTieu: string;
    loaiDnghi: string;
    namDnghi: number;
    canCuVeGia: string;
    ngayTaoDen: any;
    ngayTaoTu: any;
    paggingReq: Pagging = new Pagging();
    trangThai: string = Status.TT_01;

    request() {
        return {
            loaiTimKiem: this.loaiTimKiem,
            maLoai: this.maLoai,
            soLan: this.soLan,
            maDnghi: this.maDnghi,
            maDvi: this.maDvi,
            soQdChiTieu: this.soQdChiTieu,
            loaiDnghi: this.loaiDnghi,
            namDnghi: this.namDnghi,
            canCuVeGia: this.canCuVeGia,
            ngayTaoTu: this.ngayTaoTu ? Utils.fmtDate(this.ngayTaoTu) : null,
            ngayTaoDen: this.ngayTaoDen ? Utils.fmtDate(this.ngayTaoDen) : null,
            paggingReq: this.paggingReq,
            trangThai: this.trangThai,
        }
    }

    clear() {
        this.soLan = null;
        this.maDnghi = null;
        this.loaiDnghi = null;
        this.namDnghi = null;
        this.canCuVeGia = null;
        this.ngayTaoTu = null;
        this.ngayTaoDen = null;
        this.trangThai = null;
        this.soQdChiTieu = null;
    }
}

export class Perm {
    create!: string;
    edit!: string;
    delete!: string;
    pass!: string;
    approve!: string;
    accept!: string;
}

