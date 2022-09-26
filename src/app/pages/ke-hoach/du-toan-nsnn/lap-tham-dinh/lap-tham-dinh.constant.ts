import { MAIN_ROUTES } from 'src/app/layout/main/main-routing.constant';
import { LTD, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { DU_TOAN_NSNN } from '../../ke-hoach.constant';
import { DuToanNSNN } from '../du-toan-nsnn.type';

export const MAIN_ROUTE_KE_HOACH = MAIN_ROUTES.kehoach;
export const MAIN_ROUTE_DU_TOAN = DU_TOAN_NSNN;
export const LAP_THAM_DINH = 'lap-tham-dinh';

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


export const QUAN_LY_THAM_DINH_DU_TOAN_NSNN_LIST: DuToanNSNN[] = [
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Danh sách dự toán NSNN hàng năm và KHTC 03 năm',
        description: 'Danh sách dự toán NSNN hàng năm và KHTC 03 năm',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${LAP_THAM_DINH}/tim-kiem`,
        Role: [
            LTD.VIEW_REPORT,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Phê duyệt dự toán NSNN hàng năm và KHTC 03 năm',
        description: 'Phê duyệt dự toán NSNN hàng năm và KHTC 03 năm',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${LAP_THAM_DINH}/phe-duyet`,
        Role: [
            LTD.DUYET_REPORT,
            LTD.PHE_DUYET_REPORT,
            LTD.TIEP_NHAN_REPORT,
            LTD.DUYET_SYNTHETIC_REPORT,
            LTD.PHE_DUYET_SYNTHETIC_REPORT,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
        description: 'Tổng hợp số liệu dự toán NSNN hàng năm và KHTC 03 năm',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${LAP_THAM_DINH}/tong-hop`,
        Role: [
            LTD.SYNTHETIC_REPORT,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Danh sách số kiểm tra trần chi nhận từ Bộ tài chính',
        description: 'Danh sách số kiểm tra trần chi nhận từ Bộ tài chính',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${LAP_THAM_DINH}/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/0`,
        Role: [
            LTD.ADD_SKT_BTC,
            LTD.EDIT_SKT_BTC,
            LTD.DELETE_SKT_BTC,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Danh sách phương án/QĐ/CV giao số kiểm tra NSNN tại đơn vị',
        description: 'Danh sách phương án/QĐ/CV giao số kiểm tra NSNN các đơn vị',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${LAP_THAM_DINH}/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/1`,
        Role: [
            LTD.VIEW_PA_GIAO_SKT
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Danh sách số kiểm tra chi NSNN cho các đơn vị cấp dưới',
        description: 'Danh sách số kiểm tra chi NSNN cho các đơn vị cấp dưới',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${LAP_THAM_DINH}/tim-kiem-so-kiem-tra-chi-nsnn`,
        Role: [
            LTD.VIEW_PA_GIAO_SKT,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Danh sách nhận số kiểm tra chi NSNN nhận từ đơn vị cấp trên',
        description: 'Danh sách nhận số kiểm tra chi NSNN nhận từ đơn vị cấp trên',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_DU_TOAN}/${LAP_THAM_DINH}/nhan-so-kiem-tra-chi-nsnn`,
        Role: [
            LTD.NHAN_SKT,
        ],
        isDisabled: false,
    },
];

export const PHU_LUC = [
    {
        id: '13',
        tenDm: 'Tổng hợp nhu cầu chi ngân sách nhà nước giai đoạn 03 năm',
        tenPl: 'Biểu mẫu số 13',
        status: false,
    },
    {
        id: '14',
        tenDm: 'Tổng hợp nhu cầu chi đầu tư phát triển giai đoạn 3 năm',
        tenPl: 'Biểu mẫu số 14',
        status: false,
    },

    {
        id: '16',
        tenDm: 'Tổng hợp nhu cầu chi thường xuyên giai đoạn 03 năm',
        tenPl: 'Biểu mẫu số 16',
        status: false,
    },
    {
        id: '17',
        tenDm: 'Chi tiết nhu cầu chi thường xuyên giai đoạn 03 năm',
        tenPl: 'Biểu mẫu số 17',
        status: false,
    },
    {
        id: '18',
        tenDm: 'Tổng hợp mục tiêu nhiệm vụ chủ yếu và nhu cầu chi mới giai đoạn 03 năm',
        tenPl: 'Biểu mẫu số 18',
        status: false,
    },
];


