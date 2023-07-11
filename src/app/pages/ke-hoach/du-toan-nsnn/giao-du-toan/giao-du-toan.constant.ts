import { GDT } from "src/app/Utility/utils";


export const TAB_LIST = [
    {
        name: 'Quyết định từ Bộ Tài Chính',
        code: 'dsquyetDinh',
        status: true,
        role: [GDT.EDIT_REPORT_BTC],
        isSelected: false,
    },
    {
        name: 'Phân bổ số trần chi ',
        code: 'dsphanBo',
        status: true,
        role: [
            GDT.VIEW_REPORT_PA_PBDT,
            GDT.DELETE_REPORT_PA_PBDT,
            GDT.EDIT_REPORT_PA_PBDT,
            GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Số trần chi giao từ đơn vị cấp trên',
        code: 'dsGiaoTuCapTren',
        status: true,
        role: [GDT.NHAN_PA_PBDT],
        isSelected: false,
    },
    {
        name: 'Báo cáo từ đơn vị cấp dưới',
        code: 'baoCaoCapDuoi',
        status: true,
        role: [
            GDT.XEM_PA_TONGHOP_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        code: 'tongHopBaoCaoCapDuoi',
        status: true,
        role: [
            GDT.XEM_PA_TONGHOP_PBDT,
        ],
        isSelected: false,
    },
    {
        name: 'Danh sách báo cáo',
        code: 'danhSachBaoCao',
        status: true,
        role: [
            GDT.EDIT_REPORT_TH,
            GDT.XOA_REPORT_TH,
            GDT.XEM_PA_TONGHOP_PBDT,
            GDT.VIEW_REPORT_TH,
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

export class Form {
    id: string;
    maLoai: string;
    tenPl: string;
    tenDm: string;
    trangThai: string;
    maDviTien: string;
    lyDoTuChoi: string;
    thuyetMinh: string;
    giaoCho: string;
    lstCtietDchinh: any[];
    checked: boolean;
    lstFiles: Doc[];
    fileDinhKems: any[];
    listIdDeleteFiles: string[];

    maBieuMau: string;
    nguoiBcao: string;
    lstCtietBcaos: any[];
    hsBhDuoi: number;
    hsBhTu: number;
}

export class Doc {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: number;
}
