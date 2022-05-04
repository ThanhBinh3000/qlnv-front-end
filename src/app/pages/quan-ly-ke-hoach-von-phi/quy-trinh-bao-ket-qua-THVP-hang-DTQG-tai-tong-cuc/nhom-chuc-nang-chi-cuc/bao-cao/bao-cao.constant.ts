export const TAB_SELECTED = {
    baoCao1: 4,
    baoCao2: 5,
    baoCao3: 6,
    baoCao4: 7,
    baoCao5: 8,
    baoCao6: 9,
    baoCao7: 10,
  };
  
  export const LISTBIEUMAUDOT = [
    {
      maPhuLuc:4,
      tenPhuLuc: '02/BCN',
      tieuDe: 'Báo cáo nhập mua hàng dự trữ quốc gia đợt ',
      status: false,
    },
    {
      maPhuLuc:5,
      tenPhuLuc: '03/BCX',
      tieuDe: 'Báo cáo xuất hàng dự trữ quốc gia đợt ',
      status: false,
    },
    {
      maPhuLuc:6,
      tenPhuLuc: '04a/BCPN-X_x',
      tieuDe: 'Báo cáo chi tiết thực hiện phí xuất hàng DTQG đợt ',
      status: false,
    },
    {
        maPhuLuc:7,
        tenPhuLuc: '04a/BCPN-X_n',
        tieuDe: 'Báo cáo chi tiết thực hiện phí nhập mua hàng DTQG đợt ',
        status: false,
    },
    {
        maPhuLuc:8,
        tenPhuLuc: '04b/BCPN-X',
        tieuDe: 'Báo cáo chi tiết thực hiện phí xuất hàng cứu trợ, viện trợ hỗ trợ đợt ',
        status: false,
    },
    {
        maPhuLuc:9,
        tenPhuLuc: '05/BCPBQ',
        tieuDe: 'Khai thác báo cáo chi tiết thực hiện phí bảo quan lần đầu hàng DTQG đợt ',
        status: false,
    },
    // {
    //     maPhuLuc:10,
    //     tenPhuLuc: '01/BCNXBQ',
    //     tieuDe: 'Báo cáo tổng hợp thực hiện vốn mua, bán và phí nhập - phí xuất - phí bảo quản lần đầu hàng DTQG đợt ',
    //     status: false,
    // },
  ]

  export const LISTBIEUMAUNAM = [
    {
      maPhuLuc:4,
      tenPhuLuc: '02/BCN',
      tieuDe: 'Báo cáo nhập mua hàng dự trữ quốc gia năm ',
      status: false,
    },
    {
      maPhuLuc:5,
      tenPhuLuc: '03/BCX',
      tieuDe: 'Báo cáo xuất hàng dự trữ quốc gia năm ',
      status: false,
    },
    {
      maPhuLuc:6,
      tenPhuLuc: '04a/BCPN-X_x',
      tieuDe: 'Báo cáo chi tiết thực hiện phí xuất hàng DTQG năm ',
      status: false,
    },
    {
        maPhuLuc:7,
        tenPhuLuc: '04a/BCPN-X_n',
        tieuDe: 'Báo cáo chi tiết thực hiện phí nhập mua hàng DTQG năm ',
        status: false,
    },
    {
        maPhuLuc:8,
        tenPhuLuc: '04b/BCPN-X',
        tieuDe: 'Báo cáo chi tiết thực hiện phí xuất hàng cứu trợ, viện trợ hỗ trợ năm ',
        status: false,
    },
    {
        maPhuLuc:9,
        tenPhuLuc: '05/BCPBQ',
        tieuDe: 'Khai thác báo cáo chi tiết thực hiện phí bảo quan lần đầu hàng DTQG năm ',
        status: false,
    },
    // {
    //     maPhuLuc:10,
    //     tenPhuLuc: '01/BCNXBQ',
    //     tieuDe: 'Báo cáo tổng hợp thực hiện vốn mua, bán và phí nhập - phí xuất - phí bảo quản lần đầu hàng DTQG năm ',
    //     status: false,
    // },
  ]

  export const BAO_CAO_NHAP_HANG_DTQG:number = 4; //02
  export const BAO_CAO_XUAT_HANG_DTQG:number = 5; //03
  export const BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG:number = 6; //4a - xuat
  export const BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG:number = 7; //4a -nhap
  export const BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:number = 8; //4b
  export const KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:number =9; //05
  export const BAO_CAO_TONG_HOP_THUC_HIEN_VON_MUA_BAN_VA_PHI_NHAP_PHI_XUAT_PHI_BAO_QUAN_LAN_DAU:number=10

  export const SOLAMA: any = [
    {
      kyTu: 'M',
      gTri: 1000,
    },
    {
      kyTu: 'CM',
      gTri: 900,
    },
    {
      kyTu: 'D',
      gTri: 500,
    },
    {
      kyTu: 'CD',
      gTri: 400,
    },
    {
      kyTu: 'C',
      gTri: 100,
    },
    {
      kyTu: 'XC',
      gTri: 90,
    },
    {
      kyTu: 'L',
      gTri: 50,
    },
    {
      kyTu: 'XL',
      gTri: 40,
    },
    {
      kyTu: 'X',
      gTri: 10,
    },
    {
      kyTu: 'IX',
      gTri: 9,
    },
    {
      kyTu: 'V',
      gTri: 5,
    },
    {
      kyTu: 'IV',
      gTri: 4,
    },
    {
      kyTu: 'I',
      gTri: 1,
    },
  ];

  export const KHOAN_MUC: any[] = [
    {
      id: 10000,
      tenDm: "HOẠT ĐỘNG DTQG (Khoản 331)",
      idCha: 0,
    },
    {
      id: 11000,
      tenDm: "Kinh phí thực hiện tự chủ",
      idCha: 10000,
    },
    {
      id: 12000,
      tenDm: "Kinh phí không thực hiện tự chủ",
      idCha: 10000,
    },
    {
      id: 12100,
      tenDm: "Giao đơn vị thực hiện nhiệm vụ",
      idCha: 12000,
    },
    {
      id: 12110,
      tenDm: "Mua sắm, sửa chữa tài sản",
      idCha: 12100,
    },
    {
      id: 12111,
      tenDm: "Chi sửa chữa kho tàng và các công trình phụ trợ",
      idCha: 12110,
    },
    {
      id: 12120,
      tenDm: "Nghiệp vụ chuyên môn đặc thù",
      idCha: 12100,
    },
    {
      id: 12121,
      tenDm: "Phí bảo quản hàng dự trữ, phí nhập xuất hàng, phí xuất hàng cứu trợ, viện trợ, hỗ trợ chính sách",
      idCha: 12120,
    },
    {
      id: 12130,
      tenDm: "Chi khác",
      idCha: 12100,
    },
  
    {
      id: 20000,
      tenDm: "HOẠT ĐỘNG DTQG (Khoản 331)",
      idCha: 0,
    },
    {
      id: 21000,
      tenDm: "Kinh phí thực hiện tự chủ",
      idCha: 20000,
    },
    {
      id: 21100,
      tenDm: "Giao đơn vị thực hiện nhiệm vụ",
      idCha: 21000,
    },
    {
      id: 21110,
      tenDm: "Thanh toán cá nhân và quản lý hành chính",
      idCha: 21100,
    },
    {
      id: 21111,
      tenDm: "Quỹ lương",
      idCha: 21110,
    },
    {
      id: 21112,
      tenDm: "Chi quản lý hành chính theo định mức",
      idCha: 21110,
    },
    {
      id: 21113,
      tenDm: "Kinh phí thực hiện điều chỉnh tiền lương theo Nghị định số 38/2018/NĐ-CP",
      idCha: 21110,
    },
    {
      id: 21114,
      tenDm: "Kinh phí cắt giảm, tiết kiệm và thu hồi chi thường xuyên NSNN năm 2021",
      idCha: 21110,
    },
    {
      id: 22000,
      tenDm: "Kinh phí không thực hiện tự chủ",
      idCha: 20000,
    },
    {
      id: 30000,
      tenDm: "SỰ NGHIỆP GIÁO DỤC ĐÀO TẠO (Khoản 085)",
      idCha: 0,
    },
    {
      id: 31000,
      tenDm: "Kinh phí thực hiện tự chủ",
      idCha: 30000,
    },
    {
      id: 32000,
      tenDm: "Kinh phí không thực hiện tự chủ",
      idCha: 30000,
    },
    {
      id: 32100,
      tenDm: "Giao đơn vị thực hiện nhiệm vụ",
      idCha: 32000,
    },
    {
      id: 32110,
      tenDm: "Chỉ đào tạo, bồi dưỡng cán bộ, công chức trong nước",
      idCha: 32100,
    },
    {
      id: 40000,
      tenDm: "HOẠT ĐỘNG ĐẢM BẢO XÃ HỘI (Khoản 331)",
      idCha: 0,
    },
    {
      id: 41000,
      tenDm: "Kinh phí thực hiện tự chủ",
      idCha: 40000,
    },
    {
      id: 42000,
      tenDm: "Kinh phí không thực hiện tự chủ",
      idCha: 40000,
    },
  ];