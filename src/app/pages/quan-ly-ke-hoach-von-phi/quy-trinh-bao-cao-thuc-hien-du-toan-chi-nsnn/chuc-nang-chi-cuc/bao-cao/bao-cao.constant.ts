export const TAB_SELECTED = {
    phuLuc1: '1',
    phuLuc2: '2',
    phuLuc3: '3',
};

export const PHULUCLIST = [
    {
        maPhuLuc: '1',
        tenPhuLuc: 'Phụ Lục I',
        tieuDe: 'Báo cáo kết quả giải ngân dự toán chi NSNN định kỳ',
        status: false,
        lstId: ['11', '12'],
    },
    {
        maPhuLuc: '2',
        tenPhuLuc: 'Phụ Lục II',
        tieuDe: 'Báo cáo công tác giải ngân ứng dụng CNTT định kỳ',
        status: false,
        lstId: ['1111'],
    },
    {
        maPhuLuc: '3',
        tenPhuLuc: 'Phụ Lục III',
        tieuDe: 'Báo cáo công tác giải ngân vốn đầu tư xây dựng và sửa chữa lớn định kỳ',
        status: false,
        lstId: ['1111'],
    }
]

export const LISTCANBO: any[] = [
    {
        id: "10008",
        tenDm: "canbocc",
    },
    {
        id: "10002",
        tenDm: "canboc",
    },
    {
        id: "10002",
        tenDm: "canbotc",
    },
    {
        id: "51520",
        tenDm: "canbo1",
    },
    {
        id: "51550",
        tenDm: "canbo2",
    },
    {
        id: "51480",
        tenDm: "canbo",
    }
];

export const NOI_DUNG = [
    {
        id: 100,
        tenDm: "TỔNG NHU CẦU CHI NSNN",
        level: 0,
        idCha: 0,
    },
    {
        id: 110,
        tenDm: "Chi đầu tư phát triển",
        level: 1,
        idCha: 100,
    },
    {
        id: 111,
        tenDm: "Chi đầu tư các dự án",
        level: 2,
        idCha: 110,
    },
    {
        id: 112,
        tenDm: "Chi quốc phòng",
        level: 2,
        idCha: 110,
    },
    {
        id: 113,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 2,
        idCha: 110,
    },
    {
        id: 114,
        tenDm: "Chi đầu tư và hỗ trợ vốn cho DN cung cấp sản phẩm, dịch vụ công ích; các tổ chức kinh tế; các tổ chức tài chính; đầu tư vốn NN vào DN",
        level: 2,
        idCha: 110,
    },
    {
        id: 115,
        tenDm: "Chi đầu tư phát triển khác",
        level: 2,
        idCha: 110,
    },
    {
        id: 120,
        tenDm: "Chi thường xuyên*",
        level: 1,
        idCha: 100,
    },
    {
        id: 121,
        tenDm: "Chi quốc phòng",
        level: 2,
        idCha: 120,
    },
    {
        id: 122,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 2,
        idCha: 120,
    },
    {
        id: 200,
        tenDm: "CHI TỪ NGUỒN THU PHÍ ĐƯỢC ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG THEO QUY ĐỊNH",
        level: 0,
        idCha: 0,
    },
    {
        id: 210,
        tenDm: "Chi sự nghiệp",
        level: 1,
        idCha: 200,
    },
    {
        id: 220,
        tenDm: "Chi quản lý hành chính",
        level: 1,
        idCha: 200,
    },
    {
        id: 200,
        tenDm: "NHU CẦU CHI CÒN LẠI, SAU KHI TRỪ ĐI SỐ CHI TỪ NGUỒN THU ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG (A-B)",
        level: 0,
        idCha: 0,
    },
]

export const NOI_DUNG_PL2 = [
    {
        id: 100,
        tenDm: "TỔNG NHU CẦU CHI NSNN",
        level: 0,
        idCha: 0,
    },
    {
        id: 110,
        tenDm: "Chi đầu tư phát triển",
        level: 0,
        idCha: 0,
    },
    {
        id: 111,
        tenDm: "Chi đầu tư các dự án",
        level: 0,
        idCha: 0,
    },
    {
        id: 112,
        tenDm: "Chi quốc phòng",
        level: 0,
        idCha: 0,
    },
    {
        id: 113,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 0,
        idCha: 0,
    },
    {
        id: 114,
        tenDm: "Chi đầu tư và hỗ trợ vốn cho DN cung cấp sản phẩm, dịch vụ công ích; các tổ chức kinh tế; các tổ chức tài chính; đầu tư vốn NN vào DN",
        level: 0,
        idCha: 0,
    },
    {
        id: 115,
        tenDm: "Chi đầu tư phát triển khác",
        level: 0,
        idCha: 0,
    },
    {
        id: 120,
        tenDm: "Chi thường xuyên*",
        level: 0,
        idCha: 0,
    },
    {
        id: 121,
        tenDm: "Chi quốc phòng",
        level: 0,
        idCha: 0,
    },
    {
        id: 122,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 0,
        idCha: 0,
    },
    {
        id: 200,
        tenDm: "CHI TỪ NGUỒN THU PHÍ ĐƯỢC ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG THEO QUY ĐỊNH",
        level: 0,
        idCha: 0
    },
    {
        id: 210,
        tenDm: "Chi sự nghiệp",
        level: 0,
        idCha: 0,
    },
    {
        id: 220,
        tenDm: "Chi quản lý hành chính",
        level: 0,
        idCha: 0,
    },
    {
        id: 200,
        tenDm: "NHU CẦU CHI CÒN LẠI, SAU KHI TRỪ ĐI SỐ CHI TỪ NGUỒN THU ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG (A-B)",
        level: 0,
        idCha: 0
    },
]

export const MA_DU_AN = [
    {
        id: 100,
        tenDm: "TỔNG NHU CẦU CHI NSNN",
        level: 0,
        idCha: 0,
    },
    {
        id: 110,
        tenDm: "Chi đầu tư phát triển",
        level: 1,
        idCha: 100,
    },
    {
        id: 111,
        tenDm: "Chi đầu tư các dự án",
        level: 2,
        idCha: 110,
    },
    {
        id: 112,
        tenDm: "Chi quốc phòng",
        level: 2,
        idCha: 110,
    },
    {
        id: 113,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 2,
        idCha: 110,
    },
    {
        id: 114,
        tenDm: "Chi đầu tư và hỗ trợ vốn cho DN cung cấp sản phẩm, dịch vụ công ích; các tổ chức kinh tế; các tổ chức tài chính; đầu tư vốn NN vào DN",
        level: 2,
        idCha: 110,
    },
    {
        id: 115,
        tenDm: "Chi đầu tư phát triển khác",
        level: 2,
        idCha: 110,
    },
    {
        id: 120,
        tenDm: "Chi thường xuyên*",
        level: 1,
        idCha: 100,
    },
    {
        id: 121,
        tenDm: "Chi quốc phòng",
        level: 2,
        idCha: 120,
    },
    {
        id: 122,
        tenDm: "Chi an ninh và trật tự ATXH",
        level: 2,
        idCha: 120,
    },
    {
        id: 200,
        tenDm: "CHI TỪ NGUỒN THU PHÍ ĐƯỢC ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG THEO QUY ĐỊNH",
        level: 0,
        idCha: 0,
    },
    {
        id: 210,
        tenDm: "Chi sự nghiệp",
        level: 1,
        idCha: 200,
    },
    {
        id: 220,
        tenDm: "Chi quản lý hành chính",
        level: 1,
        idCha: 200,
    },
    {
        id: 200,
        tenDm: "NHU CẦU CHI CÒN LẠI, SAU KHI TRỪ ĐI SỐ CHI TỪ NGUỒN THU ĐỂ LẠI CHO ĐƠN VỊ SỬ DỤNG (A-B)",
        level: 0,
        idCha: 0,
    },
]