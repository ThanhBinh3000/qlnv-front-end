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
    lstCtietLapThamDinhs: any[];
    hsBhDuoi: number;
    hsBhTu: number;
    lstFiles: Doc[];
    fileDinhKems: any[];
    listIdDeleteFiles: string[];
}

export class History {
    id: string;
    maBcao: string;
    lan: number;
    ngayTao: string;
    nguoiTao: string;
    trangThai: string;
}

export class Report {
    id: string;
    namBcao: number;
    lan: number;
    lstBcaoDviTrucThuocs: any[];
    lstLapThamDinhs: Form[];
    lstFiles: any[];
    ngayTao: any;
    nguoiTao: string;
    maBcao: string;
    maDvi: string;
    maDviCha: string;
    trangThai: string;
    ngayTrinh: any;
    ngayDuyet: any;
    ngayPheDuyet: any;
    ngayTraKq: any;
    congVan: Doc;
    lyDoTuChoi: string;
    // giaoSoTranChiId: string;
    thuyetMinh: string;
    fileDinhKems: any[];
    listIdDeleteFiles: string[];
    tongHopTuIds: any[];
    lichSu: History[];
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
    viewAppVal?: boolean = true;                       // quyen xem tham dinh
    editAppVal?: boolean = true;                       // quyen sua tham dinh
}

export class CoeffIns {
    id: string;
    stt: string;
    maDmuc: string;
    tenDmuc: string;
    maDviTinh: string;
    tyLeKhoDuoi: number;
    tyLeKhoTren: number;
    ghiChu: string;
}

export class Insurance {
    id: string;
    maBaoHiem: string;
    nam: number;
    khoiTich: number;
    maDvi: string;
    trangThai: string;
    nguoiTao: string;
    ngayTao: string;
    ngayTrinh: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    lstFiles: any[];
    fileDinhKems: Doc[];
    listIdDeleteFiles: string[];
    lstCtiets: CoeffIns[];
}