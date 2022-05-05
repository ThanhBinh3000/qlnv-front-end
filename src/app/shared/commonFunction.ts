export function convertTrangThai(status: string): string {
  if (status == '00') {
    return 'Mới tạo';
  } else if (status == '01') {
    return 'Chờ duyệt';
  } else if (status == '02') {
    return 'Đã duyệt';
  } else if (status == '03') {
    return 'Từ chối';
  } else if (status == '04') {
    return 'Hủy';
  } else if (status == '05') {
    return 'Tổng hợp';
  } else if (status == '06') {
    return 'Chi cục duyệt';
  } else if (status == '07') {
    return 'Cục duyệt';
  } else if (status == '08') {
    return 'Tổng cục duyệt';
  }
}

export function convertTrangThaiUser(status: string): string {
  if (status == '00') {
    return 'Khóa';
  } else if (status == '01') {
    return 'Mở khóa';
  }
}

// public static final String TAO_MOI = "00";
// 	public static final String CHO_DUYET = "01";
// 	public static final String DUYET = "02";
// 	public static final String TU_CHOI = "03";
// 	public static final String HUY = "04";
// 	public static final String TONG_HOP = "05";
// 	public static final String CCUC_DUYET = "06";
// 	public static final String CUC_DUYET = "07";
// 	public static final String TCUC_DUYET = "08";
// 	public static final String TK_DUYET = "06";// Trang thai trung gian, thu kho phe duyet
// 	public static final String KTV_DUYET = "07";// Trang thai trung gian, ky thuat vien phe duyet
// 	public static final String KTT_DUYET = "08";// Trang thai trung gian, ke toan truong phe duyet
// 	public static final String TPHONG_DUYET = "09"; // Trang thai Truong phong duyet
// 	public static final String LANHDAO_DUYET = "10"; // Trang thai Lanh dao duyet
