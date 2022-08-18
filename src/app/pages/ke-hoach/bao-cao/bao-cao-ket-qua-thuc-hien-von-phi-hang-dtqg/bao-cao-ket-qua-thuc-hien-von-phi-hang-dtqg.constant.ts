import { MAIN_ROUTES } from 'src/app/layout/main/main-routing.constant';
import { ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { DU_TOAN_NSNN } from '../../ke-hoach.constant';
import { BaoCaoKetQuaThucHienVonPhiHangDTQG } from './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.type';

export const MAIN_ROUTE_KE_HOACH = MAIN_ROUTES.kehoach;
export const MAIN_ROUTE_BAO_CAO = 'bao-cao';
export const BAO_CAO_KET_QUA = 'bao-cao-het-qua-thuc-hien-von-phi-hang-dtqg';

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


export const BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_LIST: BaoCaoKetQuaThucHienVonPhiHangDTQG[] = [
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Danh sách báo cáo kết quả thực hiện vốn phí hàng DTQG',
        description: 'Danh sách báo cáo kết quả thực hiện vốn phí hàng DTQG',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_BAO_CAO}/${BAO_CAO_KET_QUA}/tim-kiem`,
        Role: [
            NHAN_VIEN_CC,
            TRUONG_BP_CC,
            LANH_DAO_CC,
            NHAN_VIEN_CKV,
            TRUONG_BP_CKV,
            LANH_DAO_CKV,
            NHAN_VIEN_TC,
            TRUONG_BP_TC,
            LANH_DAO_TC,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Danh sách báo cáo kết quả vốn phí hàng DTQG từ đơn vị cấp dưới',
        description: 'Danh sách báo cáo kết quả vốn phí hàng DTQG từ đơn vị cấp dưới',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_BAO_CAO}/${BAO_CAO_KET_QUA}/ds-bao-cao-ket-qua-von-phi-hang-tu-dvi-cap-duoi`,
        Role: [
            NHAN_VIEN_CKV,
            NHAN_VIEN_TC,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Kiểm tra tình tạng phê duyệt báo cáo từ đơn vị cấp dưới',
        description: 'Kiểm tra tình tạng phê duyệt báo cáo từ đơn vị cấp dưới',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_BAO_CAO}/${BAO_CAO_KET_QUA}/kiem-tra`,
        Role: [
            NHAN_VIEN_CKV,
            NHAN_VIEN_TC,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        description: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_BAO_CAO}/${BAO_CAO_KET_QUA}/tong-hop`,
        Role: [
            NHAN_VIEN_CKV,
            NHAN_VIEN_TC,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Khai thác báo cáo',
        description: 'Khai thác báo cáo',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_BAO_CAO}/${BAO_CAO_KET_QUA}/khai-thac-bao-cao`,
        Role: [
            NHAN_VIEN_TC,
        ],
        isDisabled: false,
    },
];

