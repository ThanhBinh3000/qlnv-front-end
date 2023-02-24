import { DCDT } from "src/app/Utility/utils";


export const TAB_LIST = [
    {
        name: 'Danh sách báo cáo',
        code: 'danhsach',
        status: true,
        role: [DCDT.EDIT_REPORT],
        isSelected: false,
    },
    {
        name: 'Báo cáo ',
        code: 'baocao',
        status: true,
        role: [DCDT.EDIT_REPORT],
        isSelected: false,
    },
    {
        name: 'Báo cáo từ đơn vị cấp dưới ',
        code: 'capduoi',
        status: true,
        role: [DCDT.EDIT_REPORT],
        isSelected: false,
    },
    {
        name: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        code: 'tonghop',
        status: true,
        role: [DCDT.EDIT_REPORT],
        isSelected: false,
    },

]