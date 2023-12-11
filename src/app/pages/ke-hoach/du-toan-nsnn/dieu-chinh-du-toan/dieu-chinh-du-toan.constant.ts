import { Roles, Utils } from "src/app/Utility/utils";



export class Doc {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: number;
    noiDung: string;
    isEdit: boolean = false;
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
    namBcao: number;
    dotBcao: number;
    lstDviTrucThuoc: any[];
    lstDchinh: Form[];
    lstFiles: any[];
    ngayTao: any;
    nguoiTao: string;
    maBcao: string;
    maDvi: string;
    tenDvi: string;
    maDviCha: string;
    trangThai: string;
    ngayTrinh: any;
    ngayDuyet: any;
    ngayPheDuyet: any;
    ngayTraKq: any;
    congVan: Doc;
    lyDoTuChoi: string;
    ngayCongVan: string;
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



export class Dcdt {
    static readonly DANH_SACH_BAO_CAO = 'danhsach';
    static readonly DANH_SACH_BAO_CAO_DVCD = 'capduoi';
    static readonly DANH_SACH_TONG_HOP = 'tonghop';
    static readonly BAO_CAO_01 = 'addbaocao01';
    static readonly BAO_CAO_02 = 'addbaocao02';

    static readonly TAB_LIST = [
        {
            name: 'Danh sách báo cáo',
            code: 'danhsach',
            status: true,
            role: [Roles.DCDT.VIEW_REPORT, Roles.DCDT.VIEW_SYNTHETIC_REPORT],
            isSelected: false,
        },
        {
            name: 'Báo cáo từ đơn vị cấp dưới ',
            code: 'capduoi',
            status: true,
            role: [Roles.DCDT.TIEP_NHAN_REPORT],
            isSelected: false,
        },
        {
            name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
            code: 'tonghop',
            status: true,
            role: [Roles.DCDT.SYNTHETIC_REPORT],
            isSelected: false,
        },

    ]


    static readonly PHU_LUC = [
        {
            id: 'pl01',
            tenDm: 'Tổng hợp điều chỉnh dự toán chi NSNN đợt / năm $n$',
            tenPl: 'Phụ lục I',
            status: false,
            isDel: false,
        },
        {
            id: 'pl02',
            tenDm: 'Chi tiết dự toán chi mua sắm tài sản cố định ',
            tenPl: 'Phụ lục II',
            status: false,
            isDel: true,
        },
        {
            id: 'pl03',
            tenDm: 'Chi tiết chi quản lý hành chính năm $n$ ',
            tenPl: 'Phụ lục III',
            status: false,
            isDel: true,
        },
        {
            id: 'pl04',
            tenDm: 'Chi tiết dự toán chi ứng dụng công nghệ thông tin năm $n$ ',
            tenPl: 'Phụ lục IV',
            status: false,
            isDel: true,
        },
        {
            id: 'pl05',
            tenDm: 'Dự toán phí nhập hàng DTQG ',
            tenPl: 'Phụ lục V',
            status: false,
            isDel: true,
        },
        {
            id: 'pl06',
            tenDm: 'Dự toán phí xuất hàng DTQG ',
            tenPl: 'Phụ lục VI',
            status: false,
            isDel: true,
        },
        {
            id: 'pl07',
            tenDm: 'Dự toán phí viện trợ, cứu trợ ',
            tenPl: 'Phụ lục VII',
            status: false,
            isDel: true,
        },
        {
            id: 'pl08',
            tenDm: 'Dự toán bảo quản hàng DTQG ',
            tenPl: 'Phụ lục VIII',
            status: false,
            isDel: true,
        },
        {
            id: 'pl09',
            tenDm: 'Bảng lương ',
            tenPl: 'Phụ lục IX',
            status: false,
            isDel: true,
        },
        {
            id: 'pl10',
            tenDm: 'Bảng tổng hợp tình hình thực hiện, điều chỉnh dự toán cải tạo sửa chữa lớn kho DTQG ',
            tenPl: 'Phụ lục X',
            status: false,
            isDel: true,
        },
        {
            id: 'pl11',
            tenDm: 'Chi đào tạo, bồi dưỡng cán bộ, công chức nhà nước',
            tenPl: 'Phụ lục XI',
            status: false,
            isDel: true,
        },
        {
            id: 'pl12',
            tenDm: 'Chi sự nghiệp khoa học công nghệ ',
            tenPl: 'Phụ lục XII',
            status: false,
            isDel: true,
        },
        {
            id: 'pl13',
            tenDm: 'Chi hoạt động bảo đảm xã hội',
            tenPl: 'Phụ lục XIII',
            status: false,
            isDel: true,
        },
    ];

    static readonly PHU_LUC_TH = [
        {
            id: 'pl01TH',
            tenDm: 'Tổng hợp điều chỉnh dự toán chi NSNN đợt/năm $n$ ',
            tenPl: 'Phụ lục I',
            status: false,
            isDel: false,
        },
        {
            id: 'pl02',
            tenDm: 'Chi tiết dự toán chi mua sắm tài sản cố định ',
            tenPl: 'Phụ lục II',
            status: false,
            isDel: true,
        },
        {
            id: 'pl03',
            tenDm: 'Chi tiết chi quản lý hành chính ',
            tenPl: 'Phụ lục III',
            status: false,
            isDel: true,
        },
        {
            id: 'pl04',
            tenDm: 'Chi tiết dự toán chi ứng dụng công nghệ thông tin ',
            tenPl: 'Phụ lục IV',
            status: false,
            isDel: true,
        },
        {
            id: 'pl05',
            tenDm: 'Dự toán phí nhập hàng DTQG ',
            tenPl: 'Phụ lục V',
            status: false,
            isDel: true,
        },
        {
            id: 'pl06',
            tenDm: 'Dự toán phí xuất hàng DTQG ',
            tenPl: 'Phụ lục VI',
            status: false,
            isDel: true,
        },
        {
            id: 'pl07',
            tenDm: 'Dự toán phí viện trợ, cứu trợ ',
            tenPl: 'Phụ lục VII',
            status: false,
            isDel: true,
        },
        {
            id: 'pl08',
            tenDm: 'Dự toán bảo quản hàng DTQG ',
            tenPl: 'Phụ lục VIII',
            status: false,
            isDel: true,
        },
        {
            id: 'pl09',
            tenDm: 'Bảng lương ',
            tenPl: 'Phụ lục IX',
            status: false,
            isDel: true,
        },
        {
            id: 'pl10',
            tenDm: 'Bảng tổng hợp tình hình thực hiện, điều chỉnh dự toán cải tạo sửa chữa lớn kho DTQG ',
            tenPl: 'Phụ lục X',
            status: false,
            isDel: true,
        },
        {
            id: 'pl11',
            tenDm: 'Chi đào tạo, bồi dưỡng cán bộ, công chức nhà nước ',
            tenPl: 'Phụ lục XI',
            status: false,
            isDel: true,
        },
        {
            id: 'pl12',
            tenDm: 'Chi sự nghiệp khoa học công nghệ ',
            tenPl: 'Phụ lục XII',
            status: false,
            isDel: true,
        },
        {
            id: 'pl13',
            tenDm: 'Chi hoạt động bảo đảm xã hội',
            tenPl: 'Phụ lục XIII',
            status: false,
            isDel: true,
        },
    ];

    static appendixName(id: string, nam: number) {
        const appendix = Dcdt.PHU_LUC.find(e => e.id == id);
        return [appendix.tenPl, Utils.getName(nam, appendix.tenDm)];
    }
}