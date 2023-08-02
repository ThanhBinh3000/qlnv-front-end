import { Status, Utils } from "src/app/Utility/utils";

export const TAB_LIST = [
    // {
    //     name: 'Hợp đồng',
    //     code: 'ds-hopdong',
    //     status: true,
    //     role: [],
    //     isSelected: false,
    // },
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
    {
        id: Utils.TT_BC_3,
        tenDm: "Từ chối",
    },
    {
        id: Utils.TT_BC_4,
        tenDm: "Duyệt",
    },
    {
        id: Utils.TT_BC_5,
        tenDm: "Từ chối",
    },
    {
        id: Utils.TT_BC_7,
        tenDm: "Phê duyệt",
    },
    {
        id: Utils.TT_BC_9,
        tenDm: "Phê duyệt",
    },
];

export const TRANG_THAI_DE_NGHI_CAP_DUOI = [
    {
        id: Utils.TT_BC_0,
        tenDm: "Chưa được tổng hợp",
    },
    {
        id: Utils.TT_BC_1,
        tenDm: "Đã được tổng hợp",
    },
    {
        id: Utils.TT_BC_7,
        tenDm: "Mới",
    },
    {
        id: Utils.TT_BC_9,
        tenDm: "Tiếp nhận",
    },
]

export const TABS = [
    {
        id: 1,
        tabName: 'HỢP ĐỒNG'
    },
    {
        id: 2,
        tabName: 'ĐỀ NGHỊ'
    }
]

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
    viPhamHopDong: number;
    thanhLyHdongSl: number;
    thanhLyHdongTt: number;
    lstCtiets: ItemContract[];
    // lstCtietsDnghiCapVon: ItemContract[];
}

export class Report {
    id: string;
    maHopDong: string;
    maDnghi: string;
    maLoai: string;
    maDviCha: string;
    soLan: number;
    namBcao: number;
    loaiDnghi: string;
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
    lstFiles: any[] = [];
    lstCtiets: any[] = [];
    fileDinhKems: any[] = [];
    listIdDeleteFiles: string[] = [];
}

export class ItemContract {
    id: string;
    idCapDuoi: string;
    stt: string;
    level: number;
    tenKhachHang: string;
    isParent: boolean;
    maDvi: string;
    tenDvi: string;
    qdPheDuyetKqNhaThau: string;
    slKeHoach: number;
    slHopDong: number;
    slThucHien: number;
    donGia: number;
    canCuVeGia: string;
    gtHopDong: number;
    daGiaoDuToan: number;
    gtriThucHien: number;
    soTtLuyKe: number;
    soCongVan: string;
    ghiChu: string;
    viPhamHopDong: number;
    thanhLyHdongSl: number;
    thanhLyHdongTt: number;
    // congVan: string;
    luyKeCapUng: number;
    luyKeCapVon: number;
    luyKeCong: number;
    duToanDaGiao: number;
    tongVonVaDuToanDaCap: number;
    vonDnghiCapLanNay: number;
    tongTien: number;
    soConDuocCap: number;
    cong: number;
    capUng: number;
    capVon: number;
    checkTab: string;
    soLuongKehoach: number;
    soQdPdKhlcnt: string;
    gtriHdSauVat: number;
    soLuong: number;
    gtTheoKeHoach: number;
    soConDuocTt: number;
    soDuyetTtLanNay: number;
    soConDuocTtSauTtLanNay: number;
    vonDuyetCong: number;
    vonDuyetCapUng: number;
    vonDuyetCapVon: number;
    uyNhchiNgay: string;
    uyNhchiMaNguonNs: string;
    uyNhchiNienDoNs: string;
    uyNhchiNienSoTien: number;
    tongVonVaDtDaCap: number;
    soLkeSauKhiCapLanNay: number;
    tongCap: number;
    dnghiCapvonLuyKes: Times[];
    luyKeTongCapUng: number;
    luyKeTongCapVon: number;
    luyKeTongCong: number;
    soLan: number;
    maLoai: string;
    soLuongThien: number;
    congVan: ItemCongVan;
    trangThai: string;
    maDnghi: string;
    namBcao: number;
    soQdChiTieu: string;
    loaiDnghi: string;
    ngayTao: any;
    ngayTrinh: any;
    ngayDuyet: any;
    ngayPheDuyet: any;
    thuyetMinh: string;

    // request() {
    //     const temp = Object.assign({}, this);
    //     if (this.id?.length == 38) {
    //         temp.id = null;
    //     }
    //     return temp;
    // }
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
    maLoai: string;
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

export class Dncv {
    static readonly CAP_VON = '0';
    static readonly DNGHI_CAP_VON = '1';
    static readonly GHI_NHAN_CU_VON = '1';
    static readonly CU_VON_DVCD = '2';
    static readonly THANH_TOAN = '3';
    static readonly TIEN_THUA = '4';
    static readonly VON_BAN = '5';
    static readonly HOP_DONG_VON_BAN = '6';
    static readonly QUAN_LY_THU_CHI = '7';

    static readonly THOC = "0";
    static readonly GAO = "1";
    static readonly MUOI = "2";
    static readonly VTU = "3";

    static readonly HOP_DONG = "0";
    static readonly DON_GIA = "1";

    static readonly LOAI_DE_NGHI = [
        {
            id: Dncv.GAO,
            tenDm: "Gạo",
        },
        {
            id: Dncv.THOC,
            tenDm: "Thóc",
        },
        {
            id: Dncv.MUOI,
            tenDm: "Muối",
        },
        {
            id: Dncv.VTU,
            tenDm: "Vật tư",
        },
    ];

    static suggestionName(id: string) {
        return Dncv.LOAI_DE_NGHI.find(e => e.id == id).tenDm;
    }

    static readonly CAN_CU_GIA = [
        {
            id: Dncv.HOP_DONG,
            tenDm: "Hợp đồng trúng thầu",
        },
        {
            id: Dncv.DON_GIA,
            tenDm: "Quyết định đơn giá",
        }
    ]

    static priceBasisName(id: string) {
        return Dncv.CAN_CU_GIA.find(e => e.id == id).tenDm;
    }
}

export class Pagging {
    limit: number = 10;
    page: number = 1;
}

export class Search {
    loaiTimKiem: string = '0';
    maLoai: string;
    soLan: number;
    maCapUng: string;
    maDvi: string;
    loaiDnghi: string;
    namBcao: number;
    canCuVeGia: string;
    ngayTaoDen: any;
    ngayTaoTu: any;
    paggingReq: Pagging = new Pagging();
    trangThai: string = Status.TT_01;
    trangThaiDvct: string;
    soQdChiTieu: string;
    maDnghi: string;

    request() {
        return {
            loaiTimKiem: this.loaiTimKiem,
            maLoai: this.maLoai,
            soLan: this.soLan,
            maCapUng: this.maCapUng,
            maDvi: this.maDvi,
            loaiDnghi: this.loaiDnghi,
            namBcao: this.namBcao,
            canCuVeGia: this.canCuVeGia,
            ngayTaoTu: this.ngayTaoTu ? Utils.fmtDate(this.ngayTaoTu) : null,
            ngayTaoDen: this.ngayTaoDen ? Utils.fmtDate(this.ngayTaoDen) : null,
            paggingReq: this.paggingReq,
            trangThai: this.trangThai,
            trangThaiDvct: this.trangThaiDvct,
            soQdChiTieu: this.soQdChiTieu,
            maDnghi: this.maDnghi,
        }
    }

    clear() {
        this.soLan = null;
        this.maCapUng = null;
        this.loaiDnghi = null;
        this.namBcao = null;
        this.canCuVeGia = null;
        this.ngayTaoTu = null;
        this.ngayTaoDen = null;
        this.trangThai = null;
        this.trangThaiDvct = null;
        this.soQdChiTieu = null;
        this.maDnghi = null;
    }
}