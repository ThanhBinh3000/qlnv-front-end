import { templateJitUrl } from "@angular/compiler";
import { Roles, Utils } from "src/app/Utility/utils";

export class Vp {
    static readonly DANH_SACH_BAO_CAO = 'danhsach';
    static readonly DANH_SACH_BAO_CAO_DVCD = 'capduoi';
    static readonly TONG_HOP = 'tonghop';
    static readonly KHAI_THAC_BAO_CAO = 'khaithac';
    static readonly BAO_CAO_01 = 'baocao01';
    static readonly BAO_CAO_02 = 'baocao02';
    static readonly TAB_LIST = [
        {
            name: 'Báo cáo',
            code: Vp.DANH_SACH_BAO_CAO,
            status: true,
            role: [Roles.VP.VIEW_REPORT, Roles.VP.VIEW_SYNTH_REPORT],
            isSelected: false,
        },
        {
            name: 'Báo cáo từ đơn vị cấp dưới',
            code: Vp.DANH_SACH_BAO_CAO_DVCD,
            status: true,
            role: [Roles.VP.ACCEPT_REPORT],
            isSelected: false,
        },
        {
            name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
            code: Vp.TONG_HOP,
            status: true,
            role: [Roles.VP.SYNTH_REPORT],
            isSelected: false,
        },
        {
            name: 'Khai thác báo cáo',
            code: Vp.KHAI_THAC_BAO_CAO,
            status: true,
            role: [Roles.VP.EXPORT_EXCEL_REPORT],
            isSelected: false,
        },
    ]

    static readonly BC_DOT = '1';
    static readonly BC_NAM = '2';
    static readonly LOAI_BAO_CAO = [
        {
            id: Vp.BC_DOT,
            tenDm: 'Đợt'
        },
        {
            id: Vp.BC_NAM,
            tenDm: 'Năm'
        },
    ]
    static reportTypeName(id: string): string {
        return Vp.LOAI_BAO_CAO.find(e => e.id == id).tenDm;
    }

    static readonly BM_02 = '4';
    static readonly BM_03 = '5';
    static readonly BM_04AX = '6';
    static readonly BM_04AN = '7';
    static readonly BM_04B = '8';
    static readonly BM_05 = '9';
    static readonly PHU_LUC = [
        {
            id: Vp.BM_02,
            tenPl: '02/BCN',
            tenDm: 'Báo cáo nhập mua hàng dự trữ quốc gia',
            status: false,
        },
        {
            id: Vp.BM_03,
            tenPl: '03/BCX',
            tenDm: 'Báo cáo xuất hàng dự trữ quốc gia',
            status: false,
        },
        {
            id: Vp.BM_04AX,
            tenPl: '04a/BCPN-X_x',
            tenDm: 'Báo cáo chi tiết thực hiện phí xuất hàng DTQG',
            status: false,
        },
        {
            id: Vp.BM_04AN,
            tenPl: '04a/BCPN-X_n',
            tenDm: 'Báo cáo chi tiết thực hiện phí nhập mua hàng DTQG',
            status: false,
        },
        {
            id: Vp.BM_04B,
            tenPl: '04b/BCPN-X',
            tenDm: 'Báo cáo chi tiết thực hiện phí xuất hàng cứu trợ, viện trợ hỗ trợ',
            status: false,
        },
        {
            id: Vp.BM_05,
            tenPl: '05/BCPBQ',
            tenDm: 'Báo cáo chi tiết thực hiện phí bảo quản lần đầu hàng DTQG',
            status: false,
        },
    ]

    static appendixName(id: string, loaiBcao: string, nam: number, dot: number) {
        const appendix = Vp.PHU_LUC.find(e => e.id == id);
        let tenDm: string = appendix.tenDm;
        if (loaiBcao == Vp.BC_DOT) {
            tenDm = tenDm + ' đợt ' + dot.toString();
        } else {
            tenDm = tenDm + ' năm ' + nam.toString();
        }
        return tenDm;
    }
}

export class Pagging {
    limit: number = 10;
    page: number = 1;
}

export class Search {
    maPhanBcao: string = '1';
    loaiTimKiem: string = '0';
    maDvi: string;
    maBcao: string;
    namBcao: number;
    maLoaiBcao: string;
    dotBcao: number;
    ngayTaoTu: any;
    ngayTaoDen: any;
    trangThais: string[] = [];
    paggingReq: Pagging = new Pagging();
    donVi?: string;

    request() {
        return {
            maPhanBcao: this.maPhanBcao,
            loaiTimKiem: this.loaiTimKiem,
            maDvi: this.maDvi,
            maBcao: this.maBcao,
            namBcao: this.namBcao,
            maLoaiBcao: this.maLoaiBcao,
            dotBcao: this.dotBcao,
            ngayTaoTu: this.ngayTaoTu ? Utils.fmtDate(this.ngayTaoTu) : null,
            ngayTaoDen: this.ngayTaoDen ? Utils.fmtDate(this.ngayTaoDen) : null,
            trangThais: this.trangThais,
            paggingReq: this.paggingReq,
            donVi: this.donVi,
        }
    }

    clear() {
        this.maDvi = null;
        this.maBcao = null;
        this.namBcao = null;
        this.maLoaiBcao = null;
        this.dotBcao = null;
        this.ngayTaoTu = null;
        this.ngayTaoDen = null;
        this.donVi = null;
    }
}

export class Doc {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
}

export class Form {
    id: string;
    maLoai: string;
    maDviTien: string = '1';
    lstCtietBcaos: any[] = [];
    trangThai: string;
    checked: boolean;
    tieuDe: string;
    tenPhuLuc: string;
    thuyetMinh: string;
    lyDoTuChoi: string;
    nguoiBcao: string;
    tuNgay: string;
    denNgay: string;
}

export class Report {
    id: string;
    maBcao: string;
    namBcao: number;
    dotBcao: number;
    thangBcao: number;
    trangThai: string;
    ngayTao: string;
    nguoiTao: string;
    maDvi: string;
    maDviCha: string;
    congVan: Doc;
    ngayTrinh: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    ngayTraKq: string;
    // dung cho request
    fileDinhKems: Doc[];
    listIdDeleteFiles: string[] = [];
    maPhanBcao: string = '1';
    maLoaiBcao: string;
    lstBcaos: Form[] = [];
    lstFiles: any[] = [];
    lstBcaoDviTrucThuocs: any[] = [];
    tongHopTuIds: string[] = [];
}

export class BtnStatus {
    export: boolean;                                   // trang thai cua nut export excel bao cao
    new: boolean = true;                               // trang thai tao moi lich su
    general: boolean = true;                           //trang thai tong cua ban ghi dang xet
    save?: boolean = true;                             // trang thai cua nut luu
    submit?: boolean = true;                           // trang thai cua nut trinh duyet
    pass?: boolean = true;                             // trang thai cua nut duyet, tu choi duyet
    approve?: boolean = true;                          // trang thai cua nut phe duyet, tu choi phe duyet
    accept?: boolean = true;                           // trang thai cua nut tiep nhan, tu choi tiep nhan
    print?: boolean = true;                            // trang thai cua nut in
    ok?: boolean = true;                               // trang thai cua nut chap nhan bieu mau
    finish?: boolean = true;                           // trang thai cua nut hoan tat nhap lieu
}
