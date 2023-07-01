export const TAB_SELECTED = {
    baoCao1: '4',
    baoCao2: '5',
    baoCao3: '6',
    baoCao4: '7',
    baoCao5: '8',
    baoCao6: '9',
    baoCao7: '10',
};

export const LISTBIEUMAUDOT = [
    {
        maPhuLuc: '4',
        tenPhuLuc: '02/BCN',
        tieuDe: 'Báo cáo nhập mua hàng dự trữ quốc gia đợt ',
        status: false,
        lstId: ['21', '22'],
    },
    {
        maPhuLuc: '5',
        tenPhuLuc: '03/BCX',
        tieuDe: 'Báo cáo xuất hàng dự trữ quốc gia đợt ',
        status: false,
        lstId: ['31', '32', '33'],
    },
    {
        maPhuLuc: '6',
        tenPhuLuc: '04a/BCPN-X_x',
        tieuDe: 'Báo cáo chi tiết thực hiện phí xuất hàng DTQG đợt ',
        status: false,
        lstId: ['4ax-B'],
    },
    {
        maPhuLuc: '7',
        tenPhuLuc: '04a/BCPN-X_n',
        tieuDe: 'Báo cáo chi tiết thực hiện phí nhập mua hàng DTQG đợt ',
        status: false,
        lstId: ['4an-B'],
    },
    {
        maPhuLuc: '8',
        tenPhuLuc: '04b/BCPN-X',
        tieuDe: 'Báo cáo chi tiết thực hiện phí xuất hàng cứu trợ, viện trợ hỗ trợ đợt ',
        status: false,
        lstId: ['4b-B'],
    },
    {
        maPhuLuc: '9',
        tenPhuLuc: '05/BCPBQ',
        tieuDe: 'Báo cáo chi tiết thực hiện phí bảo quản lần đầu hàng DTQG đợt ',
        status: false,
        lstId: ['5-B'],
    },
    // {
    //     maPhuLuc:10,
    //     tenPhuLuc: '01/BCNXBQ',
    //     tieuDe: 'Báo cáo tổng hợp thực hiện vốn mua, bán và phí nhập - phí xuất - phí bảo quản lần đầu hàng DTQG đợt ',
    //     status: false,
    // },
]

export const LISTBIEUMAUNAM = [
    {
        maPhuLuc: '4',
        tenPhuLuc: '02/BCN',
        tieuDe: 'Báo cáo nhập mua hàng dự trữ quốc gia năm ',
        status: false,
    },
    {
        maPhuLuc: '5',
        tenPhuLuc: '03/BCX',
        tieuDe: 'Báo cáo xuất hàng dự trữ quốc gia năm ',
        status: false,
    },
    {
        maPhuLuc: '6',
        tenPhuLuc: '04a/BCPN-X_x',
        tieuDe: 'Báo cáo chi tiết thực hiện phí xuất hàng DTQG năm ',
        status: false,
    },
    {
        maPhuLuc: '7',
        tenPhuLuc: '04a/BCPN-X_n',
        tieuDe: 'Báo cáo chi tiết thực hiện phí nhập mua hàng DTQG năm ',
        status: false,
    },
    {
        maPhuLuc: '8',
        tenPhuLuc: '04b/BCPN-X',
        tieuDe: 'Báo cáo chi tiết thực hiện phí xuất hàng cứu trợ, viện trợ hỗ trợ năm ',
        status: false,
    },
    {
        maPhuLuc: '9',
        tenPhuLuc: '05/BCPBQ',
        tieuDe: 'Báo cáo chi tiết thực hiện phí bảo quản lần đầu hàng DTQG năm ',
        status: false,
    },
]

export const BAO_CAO_NHAP_HANG_DTQG = '4'; //02
export const BAO_CAO_XUAT_HANG_DTQG = '5'; //03
export const BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG = '6'; //4a - xuat
export const BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG = '7'; //4a -nhap
export const BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO = '8'; //4b
export const KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG = '9'; //05
export const BAO_CAO_TONG_HOP_THUC_HIEN_VON_MUA_BAN_VA_PHI_NHAP_PHI_XUAT_PHI_BAO_QUAN_LAN_DAU = '10'

export const SOLAMA: any = [
    {
        kyTu: 'M',
        gTri: 1000,
    },
    {
        kyTu: 'CM',
        gTri: 900,
    },
    {
        kyTu: 'D',
        gTri: 500,
    },
    {
        kyTu: 'CD',
        gTri: 400,
    },
    {
        kyTu: 'C',
        gTri: 100,
    },
    {
        kyTu: 'XC',
        gTri: 90,
    },
    {
        kyTu: 'L',
        gTri: 50,
    },
    {
        kyTu: 'XL',
        gTri: 40,
    },
    {
        kyTu: 'X',
        gTri: 10,
    },
    {
        kyTu: 'IX',
        gTri: 9,
    },
    {
        kyTu: 'V',
        gTri: 5,
    },
    {
        kyTu: 'IV',
        gTri: 4,
    },
    {
        kyTu: 'I',
        gTri: 1,
    },
];

export const KHOAN_MUC: any[] = [
    {
        id: 10000,
        tenDm: "HOẠT ĐỘNG DTQG (Khoản 331)",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 11000,
        tenDm: "Kinh phí thực hiện tự chủ",
        idCha: 10000,
        level: 1,
        maDviTinh: 'M2',
    },
    {
        id: 12000,
        tenDm: "Kinh phí không thực hiện tự chủ",
        idCha: 10000,
        level: 1,
        maDviTinh: 'M2',
    },
    {
        id: 12100,
        tenDm: "Giao đơn vị thực hiện nhiệm vụ",
        idCha: 12000,
        level: 2,
        maDviTinh: 'M2',
    },
    {
        id: 12110,
        tenDm: "Mua sắm, sửa chữa tài sản",
        idCha: 12100,
        level: 3,
        maDviTinh: 'M2',
    },
    {
        id: 12111,
        tenDm: "Chi sửa chữa kho tàng và các công trình phụ trợ",
        idCha: 12110,
        level: 4,
        maDviTinh: 'M2',
    },
    {
        id: 12120,
        tenDm: "Nghiệp vụ chuyên môn đặc thù",
        idCha: 12100,
        level: 3,
        maDviTinh: 'M2',
    },
    {
        id: 12121,
        tenDm: "Phí bảo quản hàng dự trữ, phí nhập xuất hàng, phí xuất hàng cứu trợ, viện trợ, hỗ trợ chính sách",
        idCha: 12120,
        level: 4,
        maDviTinh: 'M2',
    },
    {
        id: 12130,
        tenDm: "Chi khác",
        idCha: 12100,
        level: 3,
        maDviTinh: 'M2',
    },

    {
        id: 20000,
        tenDm: "HOẠT ĐỘNG DTQG (Khoản 331)",
        idCha: 0,
        level: 0,
        maDviTinh: 'M2',
    },
    {
        id: 21000,
        tenDm: "Kinh phí thực hiện tự chủ",
        idCha: 20000,
        level: 1,
        maDviTinh: 'M2',
    },
    {
        id: 21100,
        tenDm: "Giao đơn vị thực hiện nhiệm vụ",
        idCha: 21000,
        level: 2,
        maDviTinh: 'M2',
    },
    {
        id: 21110,
        tenDm: "Thanh toán cá nhân và quản lý hành chính",
        idCha: 21100,
        level: 3,
        maDviTinh: 'M2',
    },
    {
        id: 21111,
        tenDm: "Quỹ lương",
        idCha: 21110,
        level: 4,
        maDviTinh: 'M2',
    },
    {
        id: 21112,
        tenDm: "Chi quản lý hành chính theo định mức",
        idCha: 21110,
        level: 4,
        maDviTinh: 'M2',
    },
    {
        id: 21113,
        tenDm: "Kinh phí thực hiện điều chỉnh tiền lương theo Nghị định số 38/2018/NĐ-CP",
        idCha: 21110,
        level: 4,
        maDviTinh: 'M2',
    },
    {
        id: 21114,
        tenDm: "Kinh phí cắt giảm, tiết kiệm và thu hồi chi thường xuyên NSNN năm 2021",
        idCha: 21110,
        level: 4,
        maDviTinh: 'M2',
    },
    {
        id: 22000,
        tenDm: "Kinh phí không thực hiện tự chủ",
        idCha: 20000,
        level: 1,
        maDviTinh: 'M2',
    },
    {
        id: 30000,
        tenDm: "SỰ NGHIỆP GIÁO DỤC ĐÀO TẠO (Khoản 085)",
        idCha: 0,
        level: 0,
        maDviTinh: 'M2',
    },
    {
        id: 31000,
        tenDm: "Kinh phí thực hiện tự chủ",
        idCha: 30000,
        level: 1,
        maDviTinh: 'M2',
    },
    {
        id: 32000,
        tenDm: "Kinh phí không thực hiện tự chủ",
        idCha: 30000,
        level: 1,
        maDviTinh: 'M2',
    },
    {
        id: 32100,
        tenDm: "Giao đơn vị thực hiện nhiệm vụ",
        idCha: 32000,
        level: 2,
        maDviTinh: 'M2',

    },
    {
        id: 32110,
        tenDm: "Chỉ đào tạo, bồi dưỡng cán bộ, công chức trong nước",
        idCha: 32100,
        level: 3,
        maDviTinh: 'M2',

    },
    {
        id: 40000,
        tenDm: "HOẠT ĐỘNG ĐẢM BẢO XÃ HỘI (Khoản 331)",
        idCha: 0,
        level: 0,
        maDviTinh: 'M2',

    },
    {
        id: 41000,
        tenDm: "Kinh phí thực hiện tự chủ",
        idCha: 40000,
        level: 1,
        maDviTinh: 'M2',
    },
    {
        id: 42000,
        tenDm: "Kinh phí không thực hiện tự chủ",
        idCha: 40000,
        level: 1,
        maDviTinh: 'M2',
    },
];

export const NOI_DUNG = [
    {
        id: 100,
        tenDm: "TỔNG NHU CẦU CHI NSNN",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 110,
        tenDm: "Chi đầu tư phát triển",
        level: 1,
        maDviTinh: 'M2',
        idCha: 100,
    },
    {
        id: 111,
        tenDm: "Chi đầu tư các dự án",
        level: 2,
        maDviTinh: 'M2',
        idCha: 110,
    },
    {
        id: 112,
        tenDm: "Chi quốc phòng",
        level: 2,
        maDviTinh: 'M2',
        idCha: 110,
    },
    {
        id: 113,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 2,
        maDviTinh: 'M2',
        idCha: 110,
    },
    {
        id: 114,
        tenDm: "Chi đầu tư và hỗ trợ vốn cho DN cung cấp sản phẩm, dịch vụ công ích; các tổ chức kinh tế; các tổ chức tài chính; đầu tư vốn NN vào DN",
        level: 2,
        maDviTinh: 'M2',
        idCha: 110,
    },
    {
        id: 115,
        tenDm: "Chi đầu tư phát triển khác",
        level: 2,
        maDviTinh: 'M2',
        idCha: 110,
    },
    {
        id: 120,
        tenDm: "Chi thường xuyên*",
        level: 1,
        maDviTinh: 'M2',
        idCha: 100,
    },
    {
        id: 121,
        tenDm: "Chi quốc phòng",
        level: 2,
        maDviTinh: 'M2',
        idCha: 120,
    },
    {
        id: 122,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 2,
        maDviTinh: 'M2',
        idCha: 120,
    },
    {
        id: 200,
        tenDm: "CHI TỪ NGUỒN THU PHÍ ĐƯỢC ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG THEO QUY ĐỊNH",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 210,
        tenDm: "Chi sự nghiệp",
        level: 1,
        maDviTinh: 'M2',
        idCha: 200,
    },
    {
        id: 220,
        tenDm: "Chi quản lý hành chính",
        level: 1,
        maDviTinh: 'M2',
        idCha: 200,
    },
    {
        id: 200,
        tenDm: "NHU CẦU CHI CÒN LẠI, SAU KHI TRỪ ĐI SỐ CHI TỪ NGUỒN THU ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG (A-B)",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
]

export const NOI_DUNG_PL2 = [
    {
        id: 100,
        tenDm: "TỔNG NHU CẦU CHI NSNN",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 110,
        tenDm: "Chi đầu tư phát triển",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 111,
        tenDm: "Chi đầu tư các dự án",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 112,
        tenDm: "Chi quốc phòng",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 113,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 114,
        tenDm: "Chi đầu tư và hỗ trợ vốn cho DN cung cấp sản phẩm, dịch vụ công ích; các tổ chức kinh tế; các tổ chức tài chính; đầu tư vốn NN vào DN",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 115,
        tenDm: "Chi đầu tư phát triển khác",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 120,
        tenDm: "Chi thường xuyên*",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 121,
        tenDm: "Chi quốc phòng",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 122,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 200,
        tenDm: "CHI TỪ NGUỒN THU PHÍ ĐƯỢC ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG THEO QUY ĐỊNH",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0
    },
    {
        id: 210,
        tenDm: "Chi sự nghiệp",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 220,
        tenDm: "Chi quản lý hành chính",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0,
    },
    {
        id: 200,
        tenDm: "NHU CẦU CHI CÒN LẠI, SAU KHI TRỪ ĐI SỐ CHI TỪ NGUỒN THU ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG (A-B)",
        level: 0,
        maDviTinh: 'M2',
        idCha: 0
    },
]