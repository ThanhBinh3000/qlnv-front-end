import { Roles, Utils } from "src/app/Utility/utils";

export class Ltd {
    static readonly DANH_SACH_BAO_CAO = 'danhsach';
    static readonly DANH_SACH_BAO_CAO_DVCD = 'capduoi';
    static readonly DANH_SACH_TONG_HOP = 'tonghop';
    static readonly DANH_SACH_BAO_HIEM = 'ds-heso';
    static readonly BAO_CAO_01 = 'baocao01';
    static readonly BAO_CAO_02 = 'baocao02';
    static readonly HE_SO_BAO_HIEM = 'baohiem';

    static readonly TAB_LIST = [
        {
            name: 'Dự toán NSNN hàng năm và KHTC 3 năm',
            code: Ltd.DANH_SACH_BAO_CAO,
            status: true,
            role: [Roles.LTD.VIEW_REPORT, Roles.LTD.VIEW_SYNTH_REPORT],
            isSelected: false,
        },
        {
            name: 'Báo cáo từ đơn vị cấp dưới',
            code: Ltd.DANH_SACH_BAO_CAO_DVCD,
            status: true,
            role: [Roles.LTD.ACCEPT_REPORT],
            isSelected: false,
        },
        {
            name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
            code: Ltd.DANH_SACH_TONG_HOP,
            status: true,
            role: [Roles.LTD.SYNTH_REPORT],
            isSelected: false,
        },
        {
            name: 'Hệ số bảo hiểm',
            code: Ltd.DANH_SACH_BAO_HIEM,
            status: true,
            role: [Roles.LTD.VIEW_COEF_INS],
            isSelected: false,
        },
    ]

    static readonly PHU_LUC = [
        {
            id: 'pl01N',
            tenDm: 'Dự toán phí nhập ',
            tenPl: 'Phụ lục 1 Nhập',
            status: false,
        },
        {
            id: 'pl01X',
            tenDm: 'Dự toán phí xuất ',
            tenPl: 'Phụ lục 1 Xuất',
            status: false,
        },
        {
            id: 'pl02',
            tenDm: 'Phí VTCT',
            tenPl: 'Phụ lục 2',
            status: false,
        },

        {
            id: 'pl03',
            tenDm: 'Dự toán phí bảo quản hàng DTQG năm $n$',
            tenPl: 'Phụ lục 3',
            status: false,
        },
        {
            id: 'pl04',
            tenDm: 'Dự toán chi ứng dụng CNTT năm $n$ giai đoạn $n$ - $n+2$',
            tenPl: 'Phụ lục 4',
            status: false,
        },
        {
            id: 'pl05',
            tenDm: 'Chi sửa chữa kho tàng và các công trình phụ trợ',
            tenPl: 'Phụ lục 5',
            status: false,
        },
        {
            id: 'pl06',
            tenDm: 'Đề xuất nhu cầu trang bị tài sản là máy móc, thiết bị chuyên dùng phục vụ công tác nhập, xuất, bảo quản năm $n$ - $n+2$',
            tenPl: 'Phụ lục 6',
            status: false,
        },
        {
            id: 'plda',
            tenDm: 'Phương án phân bổ kế hoạch vốn đầu tư công nguồn NSNN năm $n$',
            tenPl: 'Phụ lục dự án',
            status: false,
        },
        {
            id: 'pl_bh_hang',
            tenDm: 'Danh mục, giá trị hàng DTQG tham gia bảo hiểm',
            tenPl: 'Bảo hiểm hàng',
            status: false,
        },
        {
            id: 'pl_bh_kho',
            tenDm: 'Danh mục, giá trị kho DTQG tham gia bảo hiểm',
            tenPl: 'Bảo hiểm kho',
            status: false,
        },
        {
            id: 'pl_bh',
            tenDm: 'Danh mục, giá trị hàng, kho DTQG tham gia bảo hiểm',
            tenPl: 'Bảo hiểm',
            status: false,
        },
        {
            id: 'TT342_13.1',
            tenDm: 'Cơ sở tính chi sự nghiệp giáo dục - đào tạo và dạy nghề',
            tenPl: 'Biểu mẫu 13.1',
            status: false,
        },
        {
            id: 'TT342_13.3',
            tenDm: 'Cơ sở tính chi sự nghiệp khoa học và công nghệ',
            tenPl: 'Biểu mẫu 13.3',
            status: false,
        },

        {
            id: 'TT342_13.8',
            tenDm: 'Cơ sở tính chi các hoạt động kinh tế',
            tenPl: 'Biểu mẫu 13.8',
            status: false,
        },
        {
            id: 'TT342_13.10',
            tenDm: 'Cơ sở tính chi thực hiện chính sách đối với các đối tượng thuộc lĩnh vực bảo đảm xã hội',
            tenPl: 'Biểu mẫu 13.10',
            status: false,
        },
        {
            id: 'TT342_14',
            tenDm: 'Cơ sở tính chi hoạt động của các cơ quan quản lý nhà nước, đảng, đoàn thể',
            tenPl: 'Biểu mẫu 14',
            status: false,
        },
        {
            id: 'TT342_15.1',
            tenDm: 'Báo cáo biên chế - tiền lương của các cơ quan quản lý nhà nước, đảng, đoàn thể',
            tenPl: 'Biểu mẫu 15.1',
            status: false,
        },
        {
            id: 'TT342_15.2',
            tenDm: 'Báo cáo lao động - tiền lương - nguồn kinh phí đảm bảo của các đơn vị sự nghiệp',
            tenPl: 'Biểu mẫu 15.2',
            status: false,
        },
        {
            id: 'TT342_16',
            tenDm: 'Cơ sở tính chi mua hàng dự trữ quốc gia',
            tenPl: 'Biểu mẫu 16',
            status: false,
        },
        {
            id: 'TT342_05',
            tenDm: 'Dự toán thu chi ngân sách nhà nước năm $n$',
            tenPl: 'Biểu mẫu 05',
            status: false,
        },
        {
            id: 'TT342_06',
            tenDm: 'Dự toán thu chi ngân sách nhà nước năm $n$ _ chi tiết theo các đơn vị trực thuộc',
            tenPl: 'Biểu mẫu 06',
            status: false,
        },
        {
            id: 'TT69_13',
            tenDm: 'Tổng hợp nhu cầu chi ngân sách nhà nước giai đoạn 03 năm',
            tenPl: 'Biểu mẫu 13',
            status: false,
        },
        {
            id: 'TT69_14',
            tenDm: 'Tổng hợp nhu cầu chi đầu tư phát triển giai đoạn 03 năm',
            tenPl: 'Biểu mẫu 14',
            status: false,
        },

        {
            id: 'TT69_16',
            tenDm: 'Tổng hợp nhu cầu chi thường xuyên giai đoạn 03 năm',
            tenPl: 'Biểu mẫu 16',
            status: false,
        },
        {
            id: 'TT69_17',
            tenDm: 'Chi tiết nhu cầu chi thường xuyên giai đoạn 03 năm',
            tenPl: 'Biểu mẫu 17',
            status: false,
        },
        {
            id: 'TT69_18',
            tenDm: 'Tổng hợp mục tiêu, nhiệm vụ chủ yếu và nhu cầu chi mới giai đoạn 03 năm',
            tenPl: 'Biểu mẫu 18',
            status: false,
        },
    ];

    static appendixName(id: string, nam: number) {
        const appendix = Ltd.PHU_LUC.find(e => e.id == id);
        return [appendix.tenPl, Utils.getName(nam, appendix.tenDm)];
    }

}

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
    lan: number;
    lstBcaoDviTrucThuocs: any[];
    lstLapThamDinhs: Form[];
    lstFiles: Doc[];
    ngayTao: any;
    nguoiTao: string;
    maBcao: string;
    maDvi: string;
    tenDvi: string;
    maDviCha: string;
    trangThai: string;
    ngayCongVan: string;
    ngayTrinh: any;
    ngayDuyet: any;
    ngayPheDuyet: any;
    ngayTraKq: any;
    congVan: Doc = new Doc();
    lyDoTuChoi: string;
    // giaoSoTranChiId: string;
    thuyetMinh: string;
    fileDinhKems: Doc[] = [];
    listIdDeleteFiles: string[] = [];
    tongHopTuIds: any[] = [];
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
