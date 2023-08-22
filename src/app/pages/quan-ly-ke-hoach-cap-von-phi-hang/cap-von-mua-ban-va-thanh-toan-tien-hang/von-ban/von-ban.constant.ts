import { Roles } from "src/app/Utility/utils";

export class Tab {
    static readonly DS_VON_BAN_NOP_DVCT = 'ds-nop';
    static readonly DS_VON_BAN_TU_DVCD = 'ds-nhan';
    static readonly TONG_HOP = 'tong-hop';
    static readonly VB_DON_GIA = 'vb-dongia';
    static readonly VB_DON_GIA_1 = 'vb-dongia-1';
    static readonly VB_HOP_DONG = 'vb-hopdong';
    static readonly VB_HOP_DONG_1 = 'vb-hopdong-1';
    static readonly TAB_LIST = [
        {
            name: 'Vốn bán từ đơn vị cấp dưới',
            code: Tab.DS_VON_BAN_TU_DVCD,
            status: true,
            role: Roles.CVMB.VIEW_VB_GN,
            isSelected: false,
        },
        // {
        //     name: 'Tổng hợp vốn bán từ đơn vị cấp dưới',
        //     code: Tab.TONG_HOP,
        //     status: true,
        //     role: Roles.CVMB.SYNTH_VB,
        //     isSelected: false,
        // },
        {
            name: 'Vốn bán nộp lên đơn vị cấp trên',
            code: Tab.DS_VON_BAN_NOP_DVCT,
            status: true,
            role: Roles.CVMB.VIEW_VB,
            isSelected: false,
        },
    ]
}
