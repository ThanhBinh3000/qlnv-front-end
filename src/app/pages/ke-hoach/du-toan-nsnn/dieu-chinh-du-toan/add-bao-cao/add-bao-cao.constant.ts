export const PHU_LUC = [
    {
        id: 'pl01',
        tenDm: 'Tổng hợp điều chỉnh dự toán chi NSNN đợt I/',
        tenPl: 'Phụ lục I',
        status: false,
    },
    {
        id: 'pl02',
        tenDm: 'Chi tiết dự toán chi mua sắm tài sản cố định ',
        tenPl: 'Phụ lục II',
        status: false,
    },
    {
        id: 'pl03',
        tenDm: 'Chi tiết chi quản lý hành chính ',
        tenPl: 'Phụ lục III',
        status: false,
    },
    {
        id: 'pl04',
        tenDm: 'Chi tiết dự toán chi ứng dụng công nghệ thông tin ',
        tenPl: 'Phụ lục IV',
        status: false,
    },
    {
        id: 'pl05',
        tenDm: 'Dự toán phí nhập hàng DTQG ',
        tenPl: 'Phụ lục V',
        status: false,
    },
    {
        id: 'pl06',
        tenDm: 'Dự toán phí xuất hàng DTQG ',
        tenPl: 'Phụ lục VI',
        status: false,
    },
    {
        id: 'pl07',
        tenDm: 'Dự toán phí viện trợ, cứu trợ ',
        tenPl: 'Phụ lục VII',
        status: false,
    },
    {
        id: 'pl08',
        tenDm: 'Dự toán bảo quản hàng DTQG ',
        tenPl: 'Phụ lục VIII',
        status: false,
    },
    {
        id: 'pl09',
        tenDm: 'Bảng lương ',
        tenPl: 'Phụ lục IX',
        status: false,
    },
    {
        id: 'pl10',
        tenDm: 'Bảng tổng hợp tình hình thực hiện, điều chỉnh dự toán cải tạo sửa chữa lớn kho DTQG ',
        tenPl: 'Phụ lục X',
        status: false,
    },
    {
        id: 'pl11',
        tenDm: 'Chi đào tạo, bồi dưỡng cán bộ, công chức nhà nước',
        tenPl: 'Phụ lục XI',
        status: false,
    },
    {
        id: 'pl12',
        tenDm: 'Chi sự nghiệp khoa học công nghệ ',
        tenPl: 'Phụ lục XII',
        status: false,
    },
    {
        id: 'pl13',
        tenDm: 'Chi hoạt động bảo đảm xã hội',
        tenPl: 'Phụ lục XIII',
        status: false,
    },
];

export const PHU_LUC_TH = [
    {
        id: 'pl01TH',
        tenDm: 'Tổng hợp điều chỉnh dự toán chi NSNN đợt I/',
        tenPl: 'Phụ lục I',
        status: false,
    },
    {
        id: 'pl02',
        tenDm: 'Chi tiết dự toán chi mua sắm tài sản cố định ',
        tenPl: 'Phụ lục II',
        status: false,
    },
    {
        id: 'pl03',
        tenDm: 'Chi tiết chi quản lý hành chính ',
        tenPl: 'Phụ lục III',
        status: false,
    },
    {
        id: 'pl04',
        tenDm: 'Chi tiết dự toán chi ứng dụng công nghệ thông tin ',
        tenPl: 'Phụ lục IV',
        status: false,
    },
    {
        id: 'pl05',
        tenDm: 'Dự toán phí nhập hàng DTQG ',
        tenPl: 'Phụ lục V',
        status: false,
    },
    {
        id: 'pl06',
        tenDm: 'Dự toán phí xuất hàng DTQG ',
        tenPl: 'Phụ lục VI',
        status: false,
    },
    {
        id: 'pl07',
        tenDm: 'Dự toán phí viện trợ, cứu trợ ',
        tenPl: 'Phụ lục VII',
        status: false,
    },
    {
        id: 'pl08',
        tenDm: 'Dự toán bảo quản hàng DTQG ',
        tenPl: 'Phụ lục VIII',
        status: false,
    },
    {
        id: 'pl09',
        tenDm: 'Bảng lương ',
        tenPl: 'Phụ lục IX',
        status: false,
    },
    {
        id: 'pl10',
        tenDm: 'Bảng tổng hợp tình hình thực hiện, điều chỉnh dự toán cải tạo sửa chữa lớn kho DTQG ',
        tenPl: 'Phụ lục X',
        status: false,
    },
    {
        id: 'pl11',
        tenDm: 'Chi đào tạo, bồi dưỡng cán bộ, công chức nhà nước ',
        tenPl: 'Phụ lục XI',
        status: false,
    },
    {
        id: 'pl12',
        tenDm: 'Chi sự nghiệp khoa học công nghệ ',
        tenPl: 'Phụ lục XII',
        status: false,
    },
    {
        id: 'pl13',
        tenDm: 'Chi hoạt động bảo đảm xã hội',
        tenPl: 'Phụ lục XIII',
        status: false,
    },
];


export class Doc {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: number;
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
    dotBcao: number;
    lstDviTrucThuoc: any[];
    lstDchinh: Form[];
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
    listIdFiles: string[];
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