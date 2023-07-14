import { Roles } from "src/app/Utility/utils";

export class Tab {
    static readonly DS_GNV = 'ds-gnv';
    static readonly DS_CV = 'ds-cv';
    static readonly DS_TT = 'ds-tt';
    static readonly DS_GN_TT = 'ds-gn-tt';
    static readonly DS_TTKH = 'ds-ttkh';
    static readonly CUV = 'cuv';
    static readonly TIEN_THUA = 'tienthua';
    static readonly THANH_TOAN_HOP_DONG = 'hopdong';
    static readonly THANH_TOAN_DON_GIA = 'dongia';
    static readonly THU_CHI = 'thu-chi';
    static readonly TAB_LIST = [
        {
            name: 'Ghi nhận cấp ứng vốn từ đơn vị cấp trên',
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
            name: 'Tiền thừa nộp lên đơn vị cấp trên',
            code: Tab.DS_TT,
            status: true,
            role: Roles.CVMB.VIEW_NTT,
            isSelected: false,
        },
        {
            name: 'Tiền thừa từ đơn vị cấp dưới',
            code: Tab.DS_GN_TT,
            status: true,
            role: Roles.CVMB.ACCEPT_NTT,
            isSelected: false,
        },
        {
            name: 'Thanh toán cho khách hàng',
            code: Tab.DS_TTKH,
            status: true,
            role: Roles.CVMB.VIEW_TTKH,
            isSelected: false,
        }
    ]
}

