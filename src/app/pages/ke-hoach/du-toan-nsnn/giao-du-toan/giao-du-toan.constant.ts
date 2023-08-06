// import { Roles.GDT } from "src/app/Utility/utils";


import { Roles, Utils } from "src/app/Utility/utils";

export class Gdt {
    static readonly DANH_SACH_QUYET_DINH = 'dsquyetDinh';
    static readonly DANH_SACH_PHAN_BO = 'dsphanBo';
    static readonly DANH_SACH_GIAO_TU_CAP_TREN = 'dsGiaoTuCapTren';
    static readonly DANH_SACH_BAO_CAO_TU_CAP_DUOI = 'baoCaoCapDuoi';
    static readonly DANH_SACH_BAO_CAO = 'danhSachBaoCao';
    static readonly TONG_HOP_BC_CAP_DUOI = 'tongHopBaoCaoCapDuoi';
    static readonly BAO_CAO_01 = 'baocao01';
    static readonly BAO_CAO_02 = 'baocao02';

    static readonly TAB_LIST = [
        {
            name: 'Quyết định từ Bộ Tài Chính',
            code: Gdt.DANH_SACH_QUYET_DINH,
            status: true,
            role: [Roles.GDT.EDIT_REPORT_BTC],
            isSelected: false,
        },
        {
            name: 'Danh sách báo cáo',
            code: Gdt.DANH_SACH_BAO_CAO,
            status: true,
            role: [Roles.GDT.VIEW_REPORT_TH],
            isSelected: false,
        },
        {
            name: 'Báo cáo từ đơn vị cấp dưới',
            code: Gdt.DANH_SACH_BAO_CAO_TU_CAP_DUOI,
            status: true,
            role: [Roles.GDT.XEM_PA_TONGHOP_PBDT],
            isSelected: false,
        },
        {
            name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
            code: Gdt.TONG_HOP_BC_CAP_DUOI,
            status: true,
            role: [Roles.GDT.ADD_REPORT_TH],
            isSelected: false,
        },
        {
            name: 'Số trần chi giao từ đơn vị cấp trên',
            code: Gdt.DANH_SACH_GIAO_TU_CAP_TREN,
            status: true,
            role: [Roles.GDT.NHAN_PA_PBDT],
            isSelected: false,
        },
        {
            name: 'Phân bổ số trần chi',
            code: Gdt.DANH_SACH_PHAN_BO,
            status: true,
            role: [Roles.GDT.VIEW_REPORT_PA_PBDT],
            isSelected: false,
        },
    ]

    static readonly PHU_LUC = [
        {
            id: 'pl01N',
            tenDm: 'Dự toán phí nhập hàng DTQG',
            tenPl: 'Phụ lục I_N',
            status: false,
        },
        {
            id: 'pl01X',
            tenDm: 'Dự toán phí xuất hàng DTQG',
            tenPl: 'Phụ lục I_X',
            status: false,
        },

        {
            id: 'pl02',
            tenDm: 'Dự toán chi bảo quản hàng DTQG',
            tenPl: 'Phụ lục II',
            status: false,
        },
        {
            id: 'pl03',
            tenDm: 'Dự toán phí xuất hàng DTQG cứu trợ viện trợ',
            tenPl: 'Phụ lục III',
            status: false,
        },
        {
            id: 'pl04',
            tenDm: 'Dự toán sửa chữa lớn',
            tenPl: 'Phụ lục IV',
            status: false,
        },
        {
            id: 'pl05',
            tenDm: 'Dự toán mua sắm tài sản cố định',
            tenPl: 'Phụ lục V',
            status: false,
        },
        {
            id: 'pl06',
            tenDm: 'Quỹ lương',
            tenPl: 'Phụ lục VI',
            status: false,
        },
        {
            id: 'pl07',
            tenDm: 'Chi đào tạo, bồi dưỡng cán bộ, công chức nhà nước',
            tenPl: 'Phụ lục VII',
            status: false,
        },
        {
            id: 'pl08',
            tenDm: 'Chi sự nghiệp khoa học và công nghệ',
            tenPl: 'Phụ lục VIII',
            status: false,
        },
        {
            id: 'pl09',
            tenDm: 'Phụ lục tổng hợp đề nghị giao dự toán',
            tenPl: 'Phụ lục phân bổ dự toán',
            status: false,
        },
    ];

    static appendixName(id: string, nam: number) {
        const appendix = Gdt.PHU_LUC.find(e => e.id == id);
        return [appendix.tenPl, Utils.getName(nam, appendix.tenDm)];
    }

}

export const TAB_LIST = [
    {
        name: 'Quyết định từ Bộ Tài Chính',
        code: 'dsquyetDinh',
        status: true,
        role: [Roles.GDT.EDIT_REPORT_BTC],
        isSelected: false,
    },
    {
        name: 'Phân bổ số trần chi ',
        code: 'dsphanBo',
        status: true,
        role: [
            Roles.GDT.VIEW_REPORT_PA_PBDT,
            Roles.GDT.DELETE_REPORT_PA_PBDT,
            Roles.GDT.EDIT_REPORT_PA_PBDT,
            Roles.GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Số trần chi giao từ đơn vị cấp trên',
        code: 'dsGiaoTuCapTren',
        status: true,
        role: [Roles.GDT.NHAN_PA_PBDT],
        isSelected: false,
    },
    {
        name: 'Báo cáo từ đơn vị cấp dưới',
        code: 'baoCaoCapDuoi',
        status: true,
        role: [
            Roles.GDT.XEM_PA_TONGHOP_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        code: 'tongHopBaoCaoCapDuoi',
        status: true,
        role: [
            Roles.GDT.XEM_PA_TONGHOP_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Danh sách báo cáo',
        code: 'danhSachBaoCao',
        status: true,
        role: [
            Roles.GDT.EDIT_REPORT_TH,
            Roles.GDT.XOA_REPORT_TH,
            Roles.GDT.XEM_PA_TONGHOP_PBDT,
            Roles.GDT.VIEW_REPORT_TH,
        ],
        isSelected: false,
    },
]

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
    viewAppVal?: boolean = true;                       // quyen xem tham dinh
    editAppVal?: boolean = true;                       // quyen sua tham dinh
}

export class Doc {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

export class Form {
    id: string;
    maBieuMau: string;
    tenPl: string;
    tenDm: string;
    trangThai: string;
    maDviTien: string;
    lyDoTuChoi: string;
    thuyetMinh: string;
    nguoiBcao: string;
    lstCtietBcaos: any[] = [];
    lstFiles: Doc[] = [];
    listIdDeleteFiles: string[] = [];
}



export class Report {
    id: string;
    maPa: string;
    maBcao: string; // Thêm trường maBcao	
    namPa: number;
    trangThai: string;
    maDvi: string;
    maDviCha: string; // chưa dùng	
    maGiao: string;
    soQd: Doc;
    ngayCongVan: string;
    // maLoaiDan: string;
    // maPhanGiao: string;
    maPaCha: string;
    ngayQd: any;
    namDtoan: number;
    noiQd: string;
    namBcao: number;
    maDviTien: string;
    thuyetMinh: string;
    ngayTao: any;
    nguoiTao: string;
    ngayTrinh: any;
    nguoiTrinh: string;
    ngayDuyet: any;
    nguoiDuyet: string;
    ngayPheDuyet: any;
    nguoiPheDuyet: string;
    ngayTraKq: any;
    nguoiTraKq: string;
    ngaySua: any;
    nguoiSua: string;
    lyDoTuChoi: string;
    trangThaiGiao: string;
    tenDvi: string;
    tongHopTuIds: any[];
    fileDinhKems: any[];
    lstFiles: any[];
    listIdFiles: any[];
    lstCtiets: Form[];
    lstGiaoDtoanTrucThuocs: any[];
    lichSu: History[];
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
