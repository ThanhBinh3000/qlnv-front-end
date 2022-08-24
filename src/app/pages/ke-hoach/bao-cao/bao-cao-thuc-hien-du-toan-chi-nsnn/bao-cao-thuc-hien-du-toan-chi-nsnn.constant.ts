import { MAIN_ROUTES } from 'src/app/layout/main/main-routing.constant';
import { ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { DU_TOAN_NSNN } from '../../ke-hoach.constant';
import { BaoCaoThucHienChiNSNN } from './bao-cao-thuc-hien-du-toan-chi-nsnn.type';

export const MAIN_ROUTE_KE_HOACH = MAIN_ROUTES.kehoach;
export const MAIN_ROUTE_BAO_CAO = 'bao-cao';
export const BAO_CAO_THUC_HIEN = 'bao-cao-thuc-hien-du-toan-chi-nsnn';

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


export const BAO_CAO_THUC_HIEN_CHI_NSNN_LIST: BaoCaoThucHienChiNSNN[] = [
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Danh sách báo cáo tình hình sử dụng dự toán (giải ngân)tháng/năm',
        description: 'Danh sách báo cáo tình hình sử dụng dự toán (giải ngân)tháng/năm',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_BAO_CAO}/${BAO_CAO_THUC_HIEN}/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam`,
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
        title: 'Danh sách báo cáo tình hình sử dụng dự toán (giải ngân)tháng/năm từ đơn vị dưới',
        description: 'Danh sách báo cáo tình hình sử dụng dự toán (giải ngân)tháng/năm từ đơn vị dưới',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_BAO_CAO}/${BAO_CAO_THUC_HIEN}/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-chi-cuc`,
        Role: [
            NHAN_VIEN_CKV,
            NHAN_VIEN_TC,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Kiểm tra báo cáo thực hiện dự toán (giải ngân) tháng/năm từ các đơn vị dưới',
        description: 'Kiểm tra báo cáo thực hiện dự toán (giải ngân) tháng/năm từ các đơn vị dưới',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_BAO_CAO}/${BAO_CAO_THUC_HIEN}/kiem-tra`,
        Role: [
            NHAN_VIEN_CKV,
            NHAN_VIEN_TC,
        ],
        isDisabled: false,
    },
    {
        icon: 'htvbdh_tcdt_icon-common',
        title: 'Tổng hợp báo cáo tình hình sử dụng dự toán (giải ngân) tháng/năm',
        description: 'Tổng hợp báo cáo tình hình sử dụng dự toán (giải ngân) tháng/năm',
        url: `/${MAIN_ROUTE_KE_HOACH}/${MAIN_ROUTE_BAO_CAO}/${BAO_CAO_THUC_HIEN}/tong-hop`,
        Role: [
            NHAN_VIEN_CKV,
            NHAN_VIEN_TC,
        ],
        isDisabled: false,
    },
];

