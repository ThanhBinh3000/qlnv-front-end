import { QuanLyDieuChinhDuToanChiNSNN } from './quan-ly-dieu-chinh-du-toan-chi-nsnn.type';
import { MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI, MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN } from '../../../constants/routerUrl';
export const QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN_LIST: QuanLyDieuChinhDuToanChiNSNN[] = [
	{
		icon: 'htvbdh_tcdt_icon-common',
		title: 'Tìm kiếm',
		description: 'Danh sách đề xuất điều chỉnh dự toán chi ngân sách',
		url: `/${MAIN_ROUTE_QUAN_LY_KE_HOACH_VON_PHI}/${MAIN_ROUTE_QUAN_LY_DIEU_CHINH_DU_TOAN_CHI_NSNN}/danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach`,
	},
];


export const KHOAN_MUC: any[] = [
	{
		id: 10000,
		tenDm: "HOẠT ĐỘNG DTQG (Khoản 331)",
		idCha: 0,
	},
	{
		id: 11000,
		tenDm: "Kinh phí thực hiện tự chủ",
		idCha: 10000,
	},
	{
		id: 12000,
		tenDm: "Kinh phí không thực hiện tự chủ",
		idCha: 10000,
	},
	{
		id:  12100,
		tenDm: "Giao đơn vị thực hiện nhiệm vụ",
		idCha: 12000,
	},
	{
		id: 12110,
		tenDm: "Mua sắm, sửa chữa tài sản",
		idCha: 12100,
	},
	{
		id: 12111,
		tenDm: "Chi sửa chữa kho tàng và các công trình phụ trợ",
		idCha: 12110,
	},
	{
		id: 12120,
		tenDm: "Nghiệp vụ chuyên môn đặc thù",
		idCha: 12100,
	},
	{
		id: 12121,
		tenDm: "Phí bảo quản hàng dự trữ, phí nhập xuất hàng, phí xuất hàng cứu trợ, viện trọ, hỗ trợ chính sách",
		idCha: 12120,
	},
	{
		id: 12130,
		tenDm: "Chi khác",
		idCha: 12100,
	},

	{
		id: 20000,
		tenDm: "HOẠT ĐỘNG DTQG (Khoản 331)",
		idCha: 0,
	},
	{
		id: 21000,
		tenDm: "Kinh phí thực hiện tự chủ",
		idCha: 20000,
	},
	{
		id: 21100,
		tenDm: "Giao đơn vị thực hiện nhiệm vụ",
		idCha: 21000,
	},
	{
		id: 21110,
		tenDm: "Thanh toán cá nhân và quản lý hành chính",
		idCha: 21100,
	},
	{
		id: 21111,
		tenDm: "Quỹ lương",
		idCha: 21110,
	},
	{
		id: 21112,
		tenDm: "Chi quản lý hành chính theo định mức",
		idCha: 21110,
	},
	{
		id: 21113,
		tenDm: "Kinh phí thực hiện điều chỉnh tiền lương theo Nghị định số 38/2018/NĐ-CP",
		idCha: 21110,
	},
	{
		id: 21114,
		tenDm: "Kinh phí cắt giảm, tiết kiệm và thu hồi chi thường xuyên NSNN năm 2021",
		idCha: 21110,
	},
	{
		id: 22000,
		tenDm: "Kinh phí không thực hiện tự chủ",
		idCha: 20000,
	},
	{
		id: 30000,
		tenDm: "SỰ NGHIỆP GIÁO DỤC ĐÀO TẠO (Khoản 085)",
		idCha: 0,
	},
	{
		id: 31000,
		tenDm: "Kinh phí thực hiện tự chủ",
		idCha: 30000,
	},
	{
		id: 32000,
		tenDm: "Kinh phí không thực hiện tự chủ",
		idCha: 30000,
	},
	{
		id:  32100,
		tenDm: "Giao đơn vị thực hiện nhiệm vụ",
		idCha: 32000,
	},
	{
		id: 32110,
		tenDm: "Chỉ đào tạo, bồi dưỡng cán bộ, công chức trong nước",
		idCha: 32100,
	},
	{
		id: 40000,
		tenDm: "HOẠT ĐỘNG ĐẢM BẢO XÃ HỘI (Khoản 331)",
		idCha: 0,
	},
	{
		id: 41000,
		tenDm: "Kinh phí thực hiện tự chủ",
		idCha: 40000,
	},
	{
		id: 42000,
		tenDm: "Kinh phí không thực hiện tự chủ",
		idCha: 40000,
	},
]