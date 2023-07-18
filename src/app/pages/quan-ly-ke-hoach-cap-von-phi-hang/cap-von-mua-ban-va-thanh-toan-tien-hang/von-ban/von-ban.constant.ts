import { CVMB } from "src/app/Utility/utils";

export class Tab {
    static readonly DS_VON_BAN = 'ds-vb';
    static readonly DS_HOP_DONG = 'ds-hd';
    static readonly DS_DVCD = 'ds-dvcd';
    static readonly TONG_HOP = 'tong-hop'
    static readonly HOP_DONG = 'hop-dong';
    static readonly VB_DON_GIA = 'vb-dongia';
    static readonly VB_HOP_DONG = 'vb-hopdong';
    static readonly TAB_LIST = [
        {
            name: 'Vốn bán nộp lên đơn vị cấp trên',
            code: 'nop',
            status: true,
            role: CVMB.VIEW_REPORT_NTV_BH,
            isSelected: false,
        },
        {
            name: 'Vốn bán từ đơn vị cấp dưới',
            code: 'gn',
            status: true,
            role: CVMB.VIEW_REPORT_GNV_BH,
            isSelected: false,
        },
    ];
}

export const TAB_LIST = [
    {
        name: 'Vốn bán nộp lên đơn vị cấp trên',
        code: 'nop',
        status: true,
        role: CVMB.VIEW_REPORT_NTV_BH,
        isSelected: false,
    },
    {
        name: 'Vốn bán từ đơn vị cấp dưới',
        code: 'gn',
        status: true,
        role: CVMB.VIEW_REPORT_GNV_BH,
        isSelected: false,
    },
]
