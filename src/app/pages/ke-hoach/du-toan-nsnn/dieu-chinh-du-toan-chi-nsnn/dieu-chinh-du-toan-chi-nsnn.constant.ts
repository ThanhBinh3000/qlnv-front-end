import { MAIN_ROUTES } from 'src/app/layout/main/main-routing.constant';
import { ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { DU_TOAN_NSNN } from '../../ke-hoach.constant';
import { DuToanNSNN } from '../du-toan-nsnn.type';

export const MAIN_ROUTE_KE_HOACH = MAIN_ROUTES.kehoach;
export const MAIN_ROUTE_DU_TOAN = DU_TOAN_NSNN;
export const DIEU_CHINH_DU_TOAN = 'dieu-chinh-du-toan-chi-nsnn';

export const NHAN_VIEN_CC = {
    unit: Utils.CHI_CUC,
    role: ROLE_CAN_BO,
}

export const TRUONG_BP_CC = {
    unit: Utils.CHI_CUC,
    role: ROLE_TRUONG_BO_PHAN,
}

export const LANH_DAO_CC = {
    unit: Utils.CHI_CUC,
    role: ROLE_LANH_DAO,
}

export const NHAN_VIEN_CKV = {
    unit: Utils.CUC_KHU_VUC,
    role: ROLE_CAN_BO,
}

export const TRUONG_BP_CKV = {
    unit: Utils.CUC_KHU_VUC,
    role: ROLE_TRUONG_BO_PHAN,
}

export const LANH_DAO_CKV = {
    unit: Utils.CUC_KHU_VUC,
    role: ROLE_LANH_DAO,
}

export const NHAN_VIEN_TC = {
    unit: Utils.TONG_CUC,
    role: ROLE_CAN_BO,
}

export const TRUONG_BP_TC = {
    unit: Utils.TONG_CUC,
    role: ROLE_TRUONG_BO_PHAN,
}

export const LANH_DAO_TC = {
    unit: Utils.TONG_CUC,
    role: ROLE_LANH_DAO,
}


export const DIEU_CHINH_DU_TOAN_NSNN_LIST: DuToanNSNN[] = [
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Tìm kiếm',
        description: 'Tìm kiếm điều chỉnh dự toán chi NSNN',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${DIEU_CHINH_DU_TOAN}/tim-kiem-dieu-chinh-du-toan-chi-NSNN`,
        Role: [
            NHAN_VIEN_CC,
            NHAN_VIEN_CKV,
            NHAN_VIEN_TC,
            TRUONG_BP_CC,
            TRUONG_BP_CKV,
            TRUONG_BP_TC,
            LANH_DAO_CC,
            LANH_DAO_CKV,
            LANH_DAO_TC
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Phê duyệt báo cáo điều chỉnh dự toán chi NSNN',
        description: 'Phê duyệt báo cáo điều chỉnh dự toán chi NSNN',
        url: `//${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${DIEU_CHINH_DU_TOAN}/phe-duyet-bao-cao-dieu-chinh`,
        Role: [
            NHAN_VIEN_CKV,
            NHAN_VIEN_TC,
            TRUONG_BP_CC,
            TRUONG_BP_CKV,
            TRUONG_BP_TC,
            LANH_DAO_CC,
            LANH_DAO_CKV,
            LANH_DAO_TC
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Tổng hợp số liệu Điều chỉnh dự toán chi NSNN',
        description: 'Tổng hợp số liệu Điều chỉnh dự toán chi NSNN',
        url: `//${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${DIEU_CHINH_DU_TOAN}/tong-hop-dieu-chinh-du-toan-chi-NSNN`,
        Role: [
            NHAN_VIEN_CKV,
            NHAN_VIEN_TC,
        ],
        isDisabled: false,
    },
];

export const PHU_LUC = [
    {
        id: '1',
        tenDm: 'Tổng hợp điều chỉnh dự toán chi ngân sách nhà nước đợt 1/năm ',
        tenPl: 'Phụ lục 01',
        status: false,
    },
    {
        id: '2',
        tenDm: 'Dự toán phí nhập xuất hàng DTQG năm ',
        tenPl: 'Phụ lục 02',
        status: false,
    },
    {
        id: '3',
        tenDm: 'Dự toán phí viện trợ cứu trợ năm ',
        tenPl: 'Phụ lục 03',
        status: false,
    },
    {
        id: '4',
        tenDm: 'Dự toán phí bảo quản hàng DTQG năm ',
        tenPl: 'Phụ lục 04',
        status: false,
    },
    {
        id: '5',
        tenDm: 'Bảng lương năm ',
        tenPl: 'Phụ lục 05',
        status: false,
    },
    {
        id: '6',
        tenDm: 'Báo cáo tình hình thực hiện phí nhập xuất, VTCT hàng dự trữ quốc gia năm ',
        tenPl: 'Phụ lục 06',
        status: false,
    },
    {
        id: '7',
        tenDm: 'Báo cáo tình hình thực hiện phí bảo quản hàng dự trữ quốc gia theo định mức năm ',
        tenPl: 'Phụ lục 07',
        status: false,
    },
    {
        id: '8',
        tenDm: 'Bảng tổng hợp tình hình thực hiện điều chỉnh dự toán cải tạo sửa chữa lớn kho DTQG năm ',
        tenPl: 'Phụ lục 08',
        status: false,
    },
];


