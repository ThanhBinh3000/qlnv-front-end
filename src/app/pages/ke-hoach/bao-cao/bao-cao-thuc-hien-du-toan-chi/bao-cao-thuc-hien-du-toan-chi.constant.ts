import { Roles, Utils } from "src/app/Utility/utils";

export class Dtc {
    //mã màn hình
    static readonly DANH_SACH_BAO_CAO = 'danhsach';
    static readonly DANH_SACH_BAO_CAO_DVCD = 'capduoi';
    static readonly DANH_SACH_TONG_HOP = 'tonghop';
    static readonly BAO_CAO_01 = 'baocao01';
    static readonly BAO_CAO_02 = 'baocao02';
    static readonly TAB_LIST = [
        {
            name: 'Báo cáo',
            code: Dtc.DANH_SACH_BAO_CAO,
            status: true,
            role: [Roles.DTC.VIEW_REPORT, Roles.DTC.VIEW_SYNTH_REPORT],
            isSelected: false,
        },
        {
            name: 'Báo cáo từ đơn vị cấp dưới',
            code: Dtc.DANH_SACH_BAO_CAO_DVCD,
            status: true,
            role: [Roles.DTC.ACCEPT_REPORT],
            isSelected: false,
        },
        {
            name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
            code: Dtc.DANH_SACH_TONG_HOP,
            status: true,
            role: [Roles.DTC.SYNTH_REPORT],
            isSelected: false,
        },
    ];
    //loại báo cáo
    static readonly BC_DINH_KY = '526';
    static readonly BC_CA_NAM = '528';
    static readonly LOAI_BAO_CAO = [
        {
            id: Dtc.BC_DINH_KY,
            tenDm: 'Báo cáo giải ngân định kỳ tháng'
        },
        {
            id: Dtc.BC_CA_NAM,
            tenDm: 'Báo cáo giải ngân cả năm'
        },
    ]
    static reportTypeName(id: string) {
        return Dtc.LOAI_BAO_CAO.find(e => e.id == id)?.tenDm;
    }
    //danh sach phu lục
    static readonly PHU_LUC_I = '1';
    static readonly PHU_LUC_II = '2';
    static readonly PHU_LUC_III = '3';
    static readonly PHU_LUC = [
        {
            id: Dtc.PHU_LUC_I,
            tenDm: 'Báo cáo kết quả giải ngân dự toán chi NSNN định kỳ',
            tenPl: 'Phụ lục I',
            status: false,
        },
        {
            id: Dtc.PHU_LUC_II,
            tenDm: 'Báo cáo công tác giải ngân ứng dụng CNTT định kỳ',
            tenPl: 'Phụ lục II',
            status: false,
        },
        {
            id: Dtc.PHU_LUC_III,
            tenDm: 'Báo cáo công tác giải ngân vốn đầu tư xây dựng và sửa chữa lớn định kỳ',
            tenPl: 'Phụ lục III',
            status: false,
        },
    ]
    static appendixName(id: string) {
        const app = Dtc.PHU_LUC.find(e => e.id == id);
        return [app.tenPl, app.tenDm];
    }

    //địa điểm xây dựng
    static readonly DIA_DIEM = [
        {
            id: '100',
            tenDm: "Hà Nội",
            level: 0,
            idCha: 0,
        },
        {
            id: '200',
            tenDm: "Thái Bình",
            level: 0,
            idCha: 0,
        },
        {
            id: '300',
            tenDm: "Lào Cai",
            level: 0,
            idCha: 0,
        },
        {
            id: '400',
            tenDm: "Tuyên Quang",
            level: 0,
            idCha: 0,
        },
    ]

    static readonly CNTT = '0.1.1.1';
    static readonly SUA_CHUA = '0.1.1.2';
}

export class Form {
    id: string;
    maLoai: string;
    maDviTien: string;
    lstCtietBcaos: any;
    trangThai: string;
    checked: boolean;
    tieuDe: string;
    tenPhuLuc: string;
    thuyetMinh: string;
    lyDoTuChoi: string;
    nguoiBcao: string;
    lstFiles: Doc[] = [];
    fileDinhKems: any[] = [];
    listIdDeleteFiles: string[] = [];
}

export class Doc {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

export class History {
    id: string;
    maBcao: string;
    namBcao: number;
    lan: number;
    ngayTao: string;
    nguoiTao: string;
    ngayTrinh: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    ngayTraKq: string;
    lyDoTuChoi: string;
    trangThai: string;
}

export class Report {
    id: string;
    maBcao: string;
    namBcao: number;
    thangBcao: number;
    trangThai: string;
    ngayTao: any;
    nguoiTao: string;
    maDvi: string;
    maDviCha: string;
    congVan: Doc;
    ngayTrinh: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    ngayTraKq: string;
    fileDinhKems: any[] = [];
    listIdDeleteFiles: string[] = [];     //list id file xoa khi cap nhat
    maLoaiBcao: string;
    maPhanBcao: string = '0';
    lstBcaos: Form[] = [];
    lstFiles: any[] = [];
    lstBcaoDviTrucThuocs: any[] = [];
    tongHopTuIds: string[] = [];
    lichSu: History[] = [];
}

export class BtnStatus {
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
    export: boolean = true;
}

export class Pagging {
    limit: number = 10;
    page: number = 1;
}

export class Search {
    maPhanBcao: string = '0';
    loaiTimKiem: string = '0';
    maDvi: string;
    maBcao: string;
    namBcao: number;
    maLoaiBcao: string;
    thangBcao: number;
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
            thangBcao: this.thangBcao,
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
        this.thangBcao = null;
        this.ngayTaoTu = null;
        this.ngayTaoDen = null;
        this.donVi = null;
    }
}


