export class Utils {
    public static FORMAT_DATE_STR = "dd/MM/yyyy";
    public static FORMAT_DATE_TIME_STR = "dd/MM/yyyy HH:mm:ss";

    // Trang thai response
    public static RESP_SUCC = 0;
    public static RESP_FAIL = 1;

    public static TYPE_USER_BACKEND = "BE";
    public static TYPE_USER_FRONTEND = "FE";

    // Trang thai
    public static MOI_TAO = "00";
    public static HOAT_DONG = "01";
    public static NGUNG_HOAT_DONG = "02";
    public static TAM_KHOA = "03";

    // Loai bao cao
    public static BCAO_CTXGD03N = "01";
    public static BCAO_02 = "02";
    public static BCAO_03 = "03";

    // Trang thái báo cáo
    public static TT_BC_0 = "0"; // Đã xóa 
    public static TT_BC_1 = "1"; // Đang soạn,
    public static TT_BC_2 = "2"; // Trình duyệt,
    public static TT_BC_3 = "3"; // Trưởng BP từ chối,
    public static TT_BC_4 = "4"; // Trưởng BP duyệt,
    public static TT_BC_5 = "5"; // Lãnh đạo từ chối,
    public static TT_BC_6 = "6"; // Lãnh đạo duyệt,
    public static TT_BC_7 = "7"; // Gửi ĐV cấp trên,
    public static TT_BC_8 = "8"; // ĐV cấp trên từ chối,
    public static TT_BC_9 = "9"; // Đv cấp trên duyệt,
    public static TT_BC_10 = "10"; // Lãnh đạo điều chỉnh,
    public static TT_BC_11 = "11"; //Trạng thái của Phương án giao số trần chi (đã giao);
    // Danh sach quyen
    public static LANH_DAO = 1;// "Lãnh Đạo";
    public static TRUONG_BO_PHAN = 2;// "Trưởng Bộ Phận";
    public static NHAN_VIEN = 3;// "Nhân Viên";

    // Cap don vi
    public static CHI_CUC = "3";
    public static CUC_KHU_VUC = "2";
    public static TONG_CUC = "1";

    //role xoa
    public static btnRoleDel = {
        "status": ['1', '3', '5', '8'],
        "unit": [1, 2],
        "role": [3],
    }

    //role luu
    public static btnRoleSave = {
        "status": ['1', '3', '5', '8'],
        "unit": [1, 2],
        "role": [3],
    }

    //role trinh duyet
    public static btnRoleApprove = {
        "status": ['1'],
        "unit": [1, 2],
        "role": [3],
    }

    //role truong bo phan
    public static btnRoleTBP = {
        "status": ['2'],
        "unit": [1, 2],
        "role": [2],
    }

    //role lanh dao
    public static btnRoleLD = {
        "status": ['4'],
        "unit": [1, 2],
        "role": [1],
    }

    //role gui don vi cap tren
    public static btnRoleGuiDVCT = {
        "status": ['6'],
        "unit": [1, 2],
        "role": [1],
    }

    //role don vi cap tren
    public static btnRoleDVCT = {
        "status": ['7'],
        "unit": [1, 2],
        "role": [3],
    }

    //role lanh dao dieu chinh
    public static btnRoleLDDC = {
        "status": ['4'],
        "unit": [1, 2],
        "role": [1],
    }

    //role copy
    public static btnRoleCOPY = {
        "status": ['2','3','4','5','6','7','8','9','10','11'],
        "unit": [1, 2],
        "role": [3],
    }

    //role in
    public static btnRolePRINT = {
        "status": ['2','3','4','5','6','7','8','9','10','11'],
        "unit": [1, 2],
        "role": [1,2,3],
    }

    //get role xoa
    public getRoleDel(status: any, unit: any, role: any) {
        return !(Utils.btnRoleDel.status.includes(status) && unit == true && Utils.btnRoleDel.role.includes(role));
    }

    //get role luu
    public getRoleSave(status: any, unit: any, role: any) {
        return !(Utils.btnRoleSave.status.includes(status) && unit == true && Utils.btnRoleSave.role.includes(role));
    }

    //get role trinh duyet
    public getRoleApprove(status: any, unit: any, role: any) {
        return !(Utils.btnRoleApprove.status.includes(status) && unit == true && Utils.btnRoleApprove.role.includes(role));
    }

    //get role truong bo phan
    public getRoleTBP(status: any, unit: any, role: any) {
        return !(Utils.btnRoleTBP.status.includes(status) && unit == true && Utils.btnRoleTBP.role.includes(role));
    }

    //get role button lanh dao
    public getRoleLD(status: any, unit: any, role: any) {
        return !(Utils.btnRoleLD.status.includes(status) && unit == true && Utils.btnRoleLD.role.includes(role));
    }

    //get role button gui don vi cap tren
    public getRoleGuiDVCT(status: any, unit: any, role: any) {
        return !(Utils.btnRoleGuiDVCT.status.includes(status) && unit == true && Utils.btnRoleGuiDVCT.role.includes(role));
    }

    //get role button don vi cap tren
    public getRoleDVCT(status: any, unit: any, role: any) {
        return !(Utils.btnRoleDVCT.status.includes(status) && unit == true && Utils.btnRoleDVCT.role.includes(role));
    }

    //role lanh dao dieu chinh
    public getRoleLDDC(status: any, unit: any, role: any) {
        return !(Utils.btnRoleLDDC.status.includes(status) && unit == true && Utils.btnRoleLDDC.role.includes(role));
    }

    //role copy
    public getRoleCopy(status: any, unit: any, role: any) {
        return !(Utils.btnRoleCOPY.status.includes(status) && unit == true && Utils.btnRoleCOPY.role.includes(role));
    }

    //role in
    public getRolePrint(status: any, unit: any, role: any) {
        return !(Utils.btnRolePRINT.status.includes(status) && unit == true && Utils.btnRolePRINT.role.includes(role));
    }

    // lay quyen
    public getRole(id: number) {
        let role;
        switch (id) {
            case 4:
                role = 'CAP_TREN'
                break;
            case 1:
                role = 'LANH_DAO'
                break;
            case 2:
                role = 'TRUONG_BO_PHAN'
                break;
            case 3:
                role = 'NHAN_VIEN'
                break;

            default:
                role = id;
                break;
        }
        return role;
    }

    // lay ten don vi theo ma don vi
    public getUnitLevel(id: number) {
        let unitLevel;
        switch (id) {
            case 1:
                unitLevel = 'TONG_CUC'
                break;
            case 2:
                unitLevel = 'CUC_KHU_VUC'
                break;
            case 3:
                unitLevel = 'CHI_CUC'
                break;
            default:
                unitLevel = id;
                break;
        }
        return unitLevel;
    }

    // lay ten trang thai theo ma trang thai
    public getStatusName(id: string) {
        let statusName;
        switch (id) {
            case Utils.TT_BC_0:
                statusName = "Đã xóa";
                break;
            case Utils.TT_BC_1:
                statusName = "Đang soạn"
                break;
            case Utils.TT_BC_2:
                statusName = "Trình duyệt"
                break;
            case Utils.TT_BC_3:
                statusName = "Trưởng BP từ chối"
                break;
            case Utils.TT_BC_4:
                statusName = "Trưởng BP duyệt"
                break;
            case Utils.TT_BC_5:
                statusName = "Lãnh đạo từ chối"
                break;
            case Utils.TT_BC_6:
                statusName = "Lãnh đạo duyệt"
                break;
            case Utils.TT_BC_7:
                statusName = "Gửi ĐV cấp trên"
                break;
            case Utils.TT_BC_8:
                statusName = "ĐV cấp trên từ chối"
                break;
            case Utils.TT_BC_9:
                statusName = "Đv cấp trên duyệt"
                break;
            case Utils.TT_BC_10:
                statusName = "Điều chỉnh theo số kiểm tra"
                break;
            case Utils.TT_BC_11:
                statusName = "Đã giao"
                break;
            default:
                statusName = id;
                break;
        }
        return statusName;
    }

    // lay ten trang thai theo ma trang thai
    public getStatusAppendixName(id: any) {
        let statusName = TRANGTHAIPHULUC.find(item => item.id == id)
        return statusName?.ten;
    }
}

// loai bao cao quan ly von phi
export const LOAIBAOCAO =[
    {
        id:'12',
        tenDm:'Xây dựng Chi thường xuyên giai đoạn 03 năm'
    },
    {
        id:'01',
        tenDm:'Xây dựng Kế hoạch danh mục, vốn đầu tư XDCB giai đoạn 03 năm'
    },
    {
        id:'02',
        tenDm:'Xây dựng Nhu cầu nhập xuất hàng DTQG hàng năm'
    },
    {
        id:'03',
        tenDm:'Xây dựng Kế hoạch bảo quản hàng năm'
    },
    {
        id:'04',
        tenDm:'Xây dựng Nhu cầu xuất hàng DTQG viện trợ cứu trợ hàng năm'
    },
    {
        id:'05',
        tenDm:'Xây dựng Kế hoạch quỹ tiền lương giai đoạn 03 năm'
    },
    {
        id:'06',
        tenDm:'Xây dựng Kế hoạch quỹ tiền lương hàng năm'
    },
    {
        id:'07',
        tenDm:'Xây dựng Thuyết minh chi các đề tài, dự án nghiên cứu khoa học giai đoạn 03 năm'
    },
    {
        id:'08',
        tenDm:'Kế hoạch xây dựng văn bản quy phạm pháp luật dự trữ quốc gia giai đoạn 03 năm'
    },
    {
        id:'09',
        tenDm:'Kế hoạch Xây dựng dự toán chi ứng dụng CNTT giai đoạn 03 năm'
    },
    {
        id:'10',
        tenDm:'Xây dựng Dự toán chi mua sắm máy móc, thiết bị chuyên dùng 03 năm'
    },
    {
        id:'11',
        tenDm:'Xây dựng Nhu cầu chi ngân sách nhà nước giai đoạn 03 năm'
    },
    {
        id:'13',
        tenDm:'Xây dựng Nhu cầu phí nhập, xuất theo các năm của giai đoạn 03 năm'
    },
    {
        id:'14',
        tenDm:'Xây dựng Kế hoạch cải tạo và sửa chữa lớn 03 năm'
    },
    {
        id:'15',
        tenDm:'Xây dựng Kế hoạch đào tạo bồi dưỡng giai đoạn 03 năm'
    },
    {
        id:'32',
        tenDm:'Xây dựng Kế hoạch đào tạo bồi dưỡng giai đoạn 03 năm (TC)'
    },
    {
      id:'16',
      tenDm:'Nhu cầu kế hoạch ĐTXD 03 năm'
    },
    {
        id:'17',
        tenDm:'Tổng hợp dự toán chi thường xuyên hàng năm'
    },
    {
        id:'18',
        tenDm:'Dự toán phí nhập xuất hàng DTQG hàng năm'
    },
    {
        id:'19',
        tenDm:'Kế hoạch bảo quản hàng năm (Phần kinh phí được hưởng theo định mức và Dự kiến kinh phí của các mặt hàng chưa có định mức)'
    },
    {
        id:'20',
        tenDm:'Dự toán phí xuất hàng DTQG viện trợ cứu trợ hàng năm'
    },
    {
        id:'21',
        tenDm:'Kế hoạch dự toán cải tạo sửa chữa hệ thống kho tàng 03 năm'
    },
    {
        id:'22',
        tenDm:'Kế hoạch quỹ tiền lương năm N+1'
    },
    {
        id:'23',
        tenDm:'Dự toán chi dự trữ quốc gia giai đoạn 03 năm'
    },
    {
        id:'24',
        tenDm:'Thuyết minh chi các đề tài, dự án nghiên cứu khoa học giai đoạn 03 năm'
    },
    {
        id:'25',
        tenDm:'Kế hoạch xây dựng văn bản quy phạm pháp luật dự trữ quốc gia giai đoạn 03 năm'
    },
    {
        id:'26',
        tenDm:'Dự toán chi ứng dụng CNTT giai đoạn 03 năm'
    },
    {
        id:'27',
        tenDm:'Dự toán chi mua sắm máy móc thiết bị chuyên dùng 03 năm'
    },
    {
        id:'28',
        tenDm:'Tổng hợp nhu cầu chi ngân sách nhà nước giai đoạn 03 năm'
    },
    {
        id:'29',
        tenDm:'Tổng hợp nhu cầu chi thường xuyên giai đoạn 03 năm'
    },
    {
        id:'30',
        tenDm:'Chi tiết nhu cầu chi thường xuyên giai đoạn 03 năm'
    },
    {
        id:'31',
        tenDm:'Tổng hợp mục tiêu nhiệm vụ chủ yếu và nhu cầu chi mới giai đoạn 03 năm'
    },
    ]
    // Loai bao cao
	// 3.2.4.3.1
    export	const QLNV_KHVONPHI_DM_VONDT_XDCBGD3N:string = "01";

	// 3.2.4.3.2
    export	const QLNV_KHVONPHI_NXUAT_DTQG_HNAM_VATTU:string = "02";

	// 3.2.4.3.3
    export	const QLNV_KHVONPHI_KHOACH_BQUAN_HNAM_MAT_HANG:string = "03";

	// 3.2.4.3.4
    export	const QLNV_KHVONPHI_NCAU_XUAT_DTQG_VTRO_HNAM:string = "04";

	// 3.2.4.3.5
    export	const QLNV_KHVONPHI_KHOACH_QUY_TIEN_LUONG_GD3N:string = "05";

	// 3.2.4.3.6
    export	const QLNV_KHVONPHI_KHOACH_QUY_TIEN_LUONG_HNAM:string = "06";

	// 3.2.4.3.7
    export	const QLNV_KHVONPHI_CHI_DTAI_DAN_NCKH_GD3N:string = "07";

	// 3.2.4.3.8
    export	const QLNV_KHVONPHI_VBAN_QPHAM_PLUAT_DTQG_GD3N:string = "08";

	// 3.2.4.3.9
    export	const QLNV_KHVONPHI_CHI_UDUNG_CNTT_GD3N:string = "09";

	// 3.2.4.3.10
    export	const QLNV_KHVONPHI_DTOAN_CHI_MUASAM_MAYMOC_TBI_GD3N:string = "10";

	// 3.2.4.3.11
    export	const QLNV_KHVONPHI_NCAU_CHI_NSNN_GD3N:string = "11";

	// 3.2.4.3.12
    export	const QLNV_KHVONPHI_CHI_TX_GD3N:string = "12";

	// 3.2.4.3.13
    export	const QLNV_KHVONPHI_NCAU_PHI_NHAP_XUAT_GD3N:string = "13";

	// 3.2.4.3.14
    export	const QLNV_KHVONPHI_KHOACH_CTAO_SCHUA_GD3N:string = "14";

	// 3.2.4.3.15
    export	const QLNV_KHVONPHI_KHOACH_DTAO_BOI_DUONG_GD3N:string = "15";

	// Loai bao cao Tổng cục
    export	const QLNV_KHVONPHI_TC_NCAU_KHOACH_DTXD_GD3N:string = "16";
    export	const QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM:string = "17";
    export	const QLNV_KHVONPHI_TC_DTOAN_PHI_NXUAT_DTQG_THOC_GAO_HNAM:string = "18";
    export	const QLNV_KHVONPHI_TC_KHOACH_BQUAN_THOC_GAO_HNAM:string = "19";
    export	const QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM:string = "20";
    export	const QLNV_KHVONPHI_TC_KHOACH_DTOAN_CTAO_SCHUA_HTHONG_KHO_TANG_GD3N:string = "21";
    export	const QLNV_KHVONPHI_TC_KHOACHC_QUY_LUONG_N1:string = "22";
    export	const QLNV_KHVONPHI_TC_DTOAN_CHI_DTQG_GD3N:string = "23";
    export	const QLNV_KHVONPHI_TC_TMINH_CHI_CAC_DTAI_DAN_NCKH_GD3N:string = "24";
    export	const QLNV_KHVONPHI_TC_KHOACH_XDUNG_VBAN_QPHAM_PLUAT_DTQG_GD3N:string = "25";
    export	const QLNV_KHVONPHI_TC_DTOAN_CHI_UDUNG_CNTT_GD3N:string = "26";
    export	const QLNV_KHVONPHI_TC_DTOAN_CHI_MSAM_MMOC_TBI_CHUYEN_DUNG_GD3N:string = "27";
    export	const QLNV_KHVONPHI_TC_THOP_NCAU_CHI_NSNN_GD3N:string = "28";
    export	const QLNV_KHVONPHI_TC_THOP_NNCAU_CHI_TX_GD3N:string = "29";
    export	const QLNV_KHVONPHI_TC_CTIET_NCAU_CHI_TX_GD3N:string = "30";
    export	const QLNV_KHVONPHI_TC_THOP_MTIEU_NVU_CYEU_NCAU_CHI_MOI_GD3N:string = "31";
    export	const QLNV_KHVONPHI_TC_KHOACH_DTAO_BOI_DUONG_GD3N:string = "32";

    // loai bao cao quy trinh thuc hien du toan chi
    export const LBCQUYTRINHTHUCHIENDUTOANCHI =[
        {
            id:526,
            tenDm:'Báo cáo giải ngân định kỳ tháng'
        },
        {
            id:527,
            tenDm:'Báo cáo giải ngân cả năm'
        },
    ]

    // loai bao cao ket qua thuc hien hang du tru quoc gia
    export const LBCKETQUATHUCHIENHANGDTQG =[
        {
            id:1,
            tenDm:'Đợt'
        },
        {
            id:2,
            tenDm:'Năm'
        },
    ]

    // trang thai ban ghi
    export const TRANGTHAI =[
        {
            id:1,
            tenDm:'Đang soạn'
        },
        {
            id:2,
            tenDm:'Trình duyệt'
        },
        {
            id:3,
            tenDm:'Trưởng BP từ chối'
        },
        {
            id:4,
            tenDm:'Trưởng BP duyệt'
        },
        {
            id:5,
            tenDm:'Lãnh đạo từ chối'
        },
        {
            id:6,
            tenDm:'Lãnh đạo duyệt'
        },
        {
            id:7,
            tenDm:'Gửi ĐV cấp trên'
        },
        {
            id:8,
            tenDm:'ĐV cấp trên từ chối'
        },
        {
            id:9,
            tenDm:'Đv cấp trên duyệt'
        },
        {
            id:10,
            tenDm:'Lãnh đạo yêu cầu điều chỉnh'
        },
        {
            id:11,
            tenDm:'Chưa đánh giá'
        },
    ]

    // trang thai ban ghi
    export const TRANGTHAITIMKIEM =[
        {
            id:"1",
            tenDm:'Đang soạn'
        },
        {
            id:"2",
            tenDm:'Trình duyệt'
        },
        {
            id:"3",
            tenDm:'Trưởng BP từ chối'
        },
        {
            id:"4",
            tenDm:'Trưởng BP duyệt'
        },
        {
            id:"5",
            tenDm:'Lãnh đạo từ chối'
        },
        {
            id:"6",
            tenDm:'Lãnh đạo duyệt'
        },
        {
            id:"7",
            tenDm:'Gửi ĐV cấp trên'
        },
        {
            id:"8",
            tenDm:'ĐV cấp trên từ chối'
        },
        {
            id:"9",
            tenDm:'Đv cấp trên duyệt'
        },
    ]

    // trang thai chi tiet bao cao
    export	const OK = "1";
    export	const NOTOK = "0";
    export	const CHUADANHGIA = "2";

    // loai trang thai gui don vi cap tren
    export const TRANGTHAIGUIDVCT =[
        {
            id:9,
            ten:'Chấp nhận'
        },
        {
            id:8,
            ten:'Không chấp nhận'
        },
        {
            id:11,
            ten:'Chưa đánh giá (để trống)'
        },
    ]

    export const TRANGTHAIPHULUC =[
        {
            id:0,
            ten:'NOT OK'
        },
        {
            id:1,
            ten:'OK'
        },
        {
            id:2,
            ten:'Chưa đánh giá (để trống)'
        }
    ]

    export const LISTBAOCAOTONGHOP =[
        {
            id:'01',
            tenDm:'Xây dựng Kế hoạch danh mục, vốn đầu tư XDCB giai đoạn 03 năm'
        },
        {
            id:'16',
            tenDm:'Nhu cầu kế hoạch ĐTXD 03 năm'
        },
        {
            id:'17',
            tenDm:'Tổng hợp dự toán chi thường xuyên hàng năm'
        },
        {
            id:'18',
            tenDm:'Dự toán phí nhập xuất hàng DTQG hàng năm'
        },
        {
            id:'19',
            tenDm:'Kế hoạch bảo quản hàng năm (Phần kinh phí được hưởng theo định mức và Dự kiến kinh phí của các mặt hàng chưa có định mức)'
        },
        {
            id:'20',
            tenDm:'Dự toán phí xuất hàng DTQG viện trợ cứu trợ hàng năm'
        },
        {
            id:'21',
            tenDm:'Kế hoạch dự toán cải tạo sửa chữa hệ thống kho tàng 03 năm'
        },
        {
            id:'22',
            tenDm:'Kế hoạch quỹ tiền lương năm N+1'
        },
        {
            id:'23',
            tenDm:'Dự toán chi dự trữ quốc gia giai đoạn 03 năm'
        },
        {
            id:'24',
            tenDm:'Thuyết minh chi các đề tài, dự án nghiên cứu khoa học giai đoạn 03 năm'
        },
        {
            id:'25',
            tenDm:'Kế hoạch xây dựng văn bản quy phạm pháp luật dự trữ quốc gia giai đoạn 03 năm'
        },
        {
            id:'26',
            tenDm:'Dự toán chi ứng dụng CNTT giai đoạn 03 năm'
        },
        {
            id:'27',
            tenDm:'Dự toán chi mua sắm máy móc thiết bị chuyên dùng 03 năm'
        },
        {
            id:'28',
            tenDm:'Tổng hợp nhu cầu chi ngân sách nhà nước giai đoạn 03 năm'
        },
        {
            id:'29',
            tenDm:'Tổng hợp nhu cầu chi thường xuyên giai đoạn 03 năm'
        },
        {
            id:'30',
            tenDm:'Chi tiết nhu cầu chi thường xuyên giai đoạn 03 năm'
        },
        {
            id:'31',
            tenDm:'Tổng hợp mục tiêu nhiệm vụ chủ yếu và nhu cầu chi mới giai đoạn 03 năm'
        },
    ]

    // loai bao cao quy trinh thuc hien du toan chi
    export const DONVITIEN =[
        {
            id:'1',
            tenDm:'Đồng',
            giaTri:1
        },
        {
            id:'2',
            tenDm:'Nghìn đồng',
            giaTri:1000
        },
        {
            id:'3',
            tenDm:'Triệu đồng',
            giaTri:1000000
        },
        {
            id:'4',
            tenDm:'Tỷ đồng',
            giaTri:1000000000
        },
    ]

    export function divMoney(value,maDonViTien){
        let donVi = DONVITIEN.find(item => item.id == maDonViTien);
        if(!value && value!=0){
            return null;
        }
        
        if(donVi){
            return value/donVi.giaTri;
        }else{
            return null;
        }
    }

    export function mulMoney(value,maDonViTien){
        
        let donVi = DONVITIEN.find(item => item.id == maDonViTien);
        if(!value && value!=0){
            return null;
        }
        
        if(donVi){
            return value*donVi.giaTri;
        }else{
            return null;
        }
    }

    
