import { Roles } from "src/app/Utility/utils";
import { Cvmb } from "../cap-von-mua-ban-va-thanh-toan-tien-hang.constant";

export class Tab {
    static readonly DS_GNV = 'ds-gnv';
    static readonly DS_CV = 'ds-cv';
    static readonly DS_TT = 'ds-tt';
    static readonly DS_GN_TT = 'ds-gn-tt';
    static readonly DS_TH_TT = 'ds-th-tt';
    static readonly DS_TTKH = 'ds-ttkh';
    static readonly CUV = 'cuv';
    static readonly TIEN_THUA = 'tienthua';
    static readonly TH_TIEN_THUA = 'th_tienthua';
    static readonly THANH_TOAN_HOP_DONG = 'hopdong';
    static readonly THANH_TOAN_DON_GIA = 'dongia';
    static readonly THU_CHI = 'thu-chi';
    static readonly TAB_LIST = [
        {
            name: 'Ghi nhận vốn từ đơn vị cấp trên',
            code: Tab.DS_GNV,
            status: true,
            role: Roles.CVMB.VIEW_GNV,
            isSelected: false,
        },
        {
            name: 'Cấp ứng vốn cho đơn vị cấp dưới',
            code: Tab.DS_CV,
            status: true,
            role: Roles.CVMB.VIEW_CV,
            isSelected: false,
        },
        {
            name: 'Quản lý thu chi',
            code: Tab.THU_CHI,
            status: true,
            role: Roles.CVMB.VIEW_NTT,
            isSelected: false,
        },
        {
            name: 'Tiền thừa nộp đơn vị cấp trên',
            code: Tab.DS_TT,
            status: true,
            role: Roles.CVMB.VIEW_NTT,
            isSelected: false,
        },
        {
            name: 'Tiền thừa đơn vị cấp dưới',
            code: Tab.DS_GN_TT,
            status: true,
            role: Roles.CVMB.ACCEPT_NTT,
            isSelected: false,
        },
        {
            name: 'Tổng hợp tiền thừa ĐVCD',
            code: Tab.DS_TH_TT,
            status: true,
            role: Roles.CVMB.VIEW_TH_NTT,
            isSelected: false,
        },
        {
            name: 'Thanh toán khách hàng',
            code: Tab.DS_TTKH,
            status: true,
            role: Roles.CVMB.VIEW_TTKH,
            isSelected: false,
        }
    ]
}

export class Vm {
    static readonly CAN_CU_GIA = [
        {
            id: Cvmb.HOP_DONG,
            tenDm: "Hợp đồng đấu thầu",
        },
        {
            id: Cvmb.DON_GIA,
            tenDm: "Quyết định đơn giá",
        }
    ]

    static priceBasisName(id: string) {
        return Vm.CAN_CU_GIA.find(e => e.id == id).tenDm;
    }
}

