import { Utils } from "src/app/Utility/utils";

export const TAB_LIST = [
    {
        name: 'Hợp đồng',
        code: 'ds-hopdong',
        status: true,
        role: [],
        isSelected: false,
    },
    {
        name: 'Cấp vốn',
        code: 'ds-capvon',
        status: true,
        role: [],
        isSelected: false,
    },
    {
        name: 'Đề nghị cấp vốn',
        code: 'ds-denghi',
        status: true,
        role: [],
        isSelected: false,
    },
    {
        name: 'Đề nghị của đơn vị cấp dưới',
        code: 'ds-denghi-donvi-capduoi',
        status: true,
        role: [],
        isSelected: false,
    },
    {
        name: 'Tổng hợp đề nghị từ đơn vị cấp dưới',
        code: 'ds-tonghop-denghi-donvi-capduoi',
        status: true,
        role: [],
        isSelected: false,
    },
    // {
    //     name: 'Tổng hợp đề nghị cấp vốn',
    //     code: 'th-denghi',
    //     status: true,
    //     role: [],
    //     isSelected: false,
    // },
]

export const TRANG_THAI = [
    {
        id: Utils.TT_BC_1,
        tenDm: "Đang soạn",
    },
    {
        id: Utils.TT_BC_2,
        tenDm: "Trình duyệt",
    },
    // {
    //     id: Utils.TT_BC_3,
    //     tenDm: "Từ chối",
    // },
    // {
    //     id: Utils.TT_BC_4,
    //     tenDm: "Duyệt",
    // },
    {
        id: Utils.TT_BC_5,
        tenDm: "Từ chối",
    },
    {
        id: Utils.TT_BC_7,
        tenDm: "Phê duyệt",
    },
];

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

export class BaoCao {
    id: string;
    maHopDong: string;
    maDnghi: string;
    soLan: number;
    namBcao: number;
    loaiDnghi: string;
    dnghiCvHopDongCtiets: ItemContract[];
    dnghiCapvonCtiets: ItemRequest[];
    lstFiles: any[];
    ngayTao: any;
    nguoiTao: string;
    maDvi: string;
    maDviTien: string;
    soQdChiTieu: string;
    canCuVeGia: string;
    trangThai: string;
    ngayTrinh: any;
    ngayDuyet: any;
    ngayPheDuyet: any;
    congVan: ItemCongVan;
    lyDoTuChoi: string;
    thuyetMinh: string;
    fileDinhKems: any[];
    listIdDeleteFiles: string[];
    maLoai: string;
}

export class ItemContract {
    id: string;
    stt: string;
    tenKhachHang: string;
    isParent: boolean;
    maDvi: string;
    tenDvi: string;
    qdPheDuyetKqNhaThau: string;
    slKeHoach: number;
    slHopDong: number;
    slThucHien: number;
    donGia: number;
    gtHopDong: number;
    daGiaoDuToan: number;
    gtriThucHien: number;
    soTtLuyKe: number;
    soCongVan: string;
    ghiChu: string;
}

export class ItemRequest {
    id: string;
    maDvi: string;
    tenDvi: string;
    tenKhachHang: string;
    isParent: boolean;
    qdPheDuyetKqNhaThau: string;
    slKeHoach: number;
    slHopDong: number;
    slThucHien: number;
    donGia: number;
    gtHopDong: number;
    duToanDaGiao: number;
    gtTheoKeHoach: number;
    gtriThucHien: number;
    soTtLuyKe: number;
    soConDuocTt: number;
    soDuyetTtLanNay: number;
    soConDuocTtSauTtLanNay: number;
    luyKeCong: number;
    luyKeCapUng: number;
    luyKeCapVon: number;
    vonDuyetCong: number;
    vonDuyetCapUng: number;
    vonDuyetCapVon: number;
    uyNhchiNgay: string;
    uyNhchiMaNguonNs: string;
    uyNhchiNienDoNs: string;
    uyNhchiNienSoTien: number;
    tongVonVaDtDaCap: number;
    vonDnghiCapLanNay: number;
    soLkeSauKhiCapLanNay: number;
    tongCap: number;
    soConDuocCap: number;
    ghiChu: string;
    dnghiCapvonLuyKes: Times[];
    luyKeTongCapUng: number;
    luyKeTongCapVon: number;
    luyKeTongCong: number;
    soLan: number;
    tongTien: number;
}

export class Times {
    id: string;
    soLan: number;
    trangThai: string;
    vonDuyetCong: number;
    vonDuyetCapUng: number;
    vonDuyetCapVon: number;
    uyNhchiNgay: string;
    uyNhchiMaNguonNs: string;
    uyNhchiNienDoNs: string;
    uyNhchiNienSoTien: number;
}