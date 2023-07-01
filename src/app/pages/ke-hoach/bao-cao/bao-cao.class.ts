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
    congVan: Doc;
    ngayTrinh: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    ngayTraKq: string;
    // dung cho request
    fileDinhKems: Doc[];
    listIdDeleteFiles: string;
    maPhanBcao: string;
    maLoaiBcao: string;
    lstBcaos: Form[] = [];
    lstFile: any[] = [];
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
