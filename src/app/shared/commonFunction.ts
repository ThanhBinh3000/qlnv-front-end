import { LOAI_HANG_DTQG, STATUS_DA_DUYET, STATUS_DA_HOAN_THANH, TEN_HANG_DTQG, TEN_LOAI_VTHH } from "../constants/config";
import VNnum2words from 'vn-num2words';
import { STATUS } from "../constants/status";

export function convertTrangThai(status: string): string {
  if (status == '00') {
    return 'Dự thảo';
  } else if (status == '01') {
    return 'Chờ duyệt';
  } else if (status == '02') {
    return 'Đã duyệt';
  } else if (status == '03') {
    return 'Từ Chối';
  } else if (status == '04') {
    return 'Hủy';
  } else if (status == '05') {
    return 'Tổng hợp';
  } else if (status == '06') {
    return 'Chi cục duyệt';
  } else if (status == '07') {
    return 'Cục duyệt';
  } else if (status == '08') {
    return 'Kỹ thuật trưởng duyệt';
  } else if (status == '09') {
    return 'Trưởng phòng duyệt';
  } else if (status == '10') {
    return 'Lãnh đạo duyệt';
  } else if (status == '11') {
    return 'Ban hành';
  } else if (status == '26') {
    return 'Chưa tạo QĐ';
  } else if (status == '27') {
    return 'Đã Dự Thảo QĐ';
  } else if (status == '28') {
    return 'Đã Ban Hành QĐ';
  } else if (status == '33') {
    return 'Chưa cập nhật';
  }
}

export function convertTrangThaiGt(status: string): string {
  if (status == '00') {
    return 'Chưa cập nhật';
  } else if (status == '01') {
    return 'Đang cập nhật';
  } else if (status == '02') {
    return 'Hoàn thành cập nhật';
  } else if (status == '03') {
    return 'Trúng thầu';
  } else if (status == '04') {
    return 'Hủy thầu';
  }
}

export function convertTrangThaiUser(status: string): string {
  if (status == '00') {
    return 'Khóa';
  } else if (status == '01') {
    return 'Mở khóa';
  }
  return '';
}

export function convertTenVthh(ten: string) {
  let nameConvert = "";
  switch (ten) {
    case TEN_HANG_DTQG.GAO:
      nameConvert = "Gạo";
      break;
    case TEN_HANG_DTQG.THOC:
      nameConvert = "Thóc";
      break;
    case TEN_HANG_DTQG.MUOI:
      nameConvert = "Muối";
      break;
    case TEN_HANG_DTQG.VAT_TU:
      nameConvert = "Vật tư";
      break;
  }
  return nameConvert;
}

export function convertIdToLoaiVthh(id: string) {
  let tenConvert = "";
  switch (id) {
    case LOAI_HANG_DTQG.GAO:
      tenConvert = TEN_HANG_DTQG.GAO;
      break;
    case LOAI_HANG_DTQG.THOC:
      tenConvert = TEN_HANG_DTQG.THOC;
      break;
    case LOAI_HANG_DTQG.MUOI:
      tenConvert = TEN_HANG_DTQG.MUOI;
      break;
    case LOAI_HANG_DTQG.VAT_TU:
      tenConvert = TEN_HANG_DTQG.VAT_TU;
      break;
  }
  return tenConvert;
}

export function convertIdToTenLoaiVthh(id: string) {
  let tenConvert = "";
  switch (id) {
    case LOAI_HANG_DTQG.GAO:
      tenConvert = TEN_LOAI_VTHH.GAO;
      break;
    case LOAI_HANG_DTQG.THOC:
      tenConvert = TEN_LOAI_VTHH.THOC;
      break;
    case LOAI_HANG_DTQG.MUOI:
      tenConvert = TEN_LOAI_VTHH.MUOI;
      break;
  }
  return tenConvert;
}

export function convertVthhToId(ten: string) {
  let idConvert = "";
  switch (ten) {
    case TEN_HANG_DTQG.GAO:
      idConvert = LOAI_HANG_DTQG.GAO;
      break;
    case TEN_HANG_DTQG.THOC:
      idConvert = LOAI_HANG_DTQG.THOC;
      break;
    case TEN_HANG_DTQG.MUOI:
      idConvert = LOAI_HANG_DTQG.MUOI;
      break;
    case TEN_HANG_DTQG.VAT_TU:
      idConvert = LOAI_HANG_DTQG.VAT_TU;
      break;
  }
  return idConvert;
}


export function convertTienTobangChu(tien: number): string {
  if (tien > 0) {
    return VNnum2words(tien);
  } else {
    return ''
  }
}

export function thongTinTrangThaiNhap(trangThai: string, statusDaDuyet?: string): string {
  if (statusDaDuyet && trangThai === statusDaDuyet) {
    return 'da-ban-hanh';
  }
  else if (trangThai === STATUS_DA_DUYET || trangThai === STATUS.DA_HOAN_THANH || trangThai == STATUS.DA_DUYET_LDTC) {
    return 'da-ban-hanh';
  } else {
    return 'du-thao-va-lanh-dao-duyet';
  }
}

export function convertDviTinh(status: string): string {
  if (status == 'M1') {
    return 'm2';
  } else if (status == 'M2') {
    return 'kg';
  } else if (status == 'M3') {
    return 'lọ';
  } else if (status == 'M4') {
    return 'chiếc';
  } else if (status == 'M5') {
    return 'cái';
  } else if (status == 'M6') {
    return 'm';
  } else if (status == 'M7') {
    return 'tạ';
  } else if (status == 'M8') {
    return 'công';
  } else if (status == 'M9') {
    return 'máy';
  } else if (status == 'M10') {
    return 'thỏi';
  } else if (status == 'M11') {
    return 'viên';
  } else if (status == 'M12') {
    return 'đồng/tấn';
  } else if (status == 'M13') {
    return 'đồng/bộ';
  } else if (status == 'M14') {
    return 'đồng/tấn năm';
  } else if (status == 'M15') {
    return 'đồng';
  } else if (status == 'M16') {
    return 'đồng/chiếc';
  } else if (status == 'M17') {
    return 'đồng/bộ năm';
  } else if (status == 'M18') {
    return 'đồng/chiếc năm';
  } else if (status == 'M19') {
    return 'hộp';
  } else if (status == 'M20') {
    return 'lần';
  } else if (status == 'M21') {
    return 'kwh';
  } else if (status == 'M22') {
    return 'bộ';
  } else if (status == 'M23') {
    return 'Tấn';
  }
}


export function convertMaCcdc(maCcdc: string): string {
  if (maCcdc == '01.01') {
    return 'Thiết bị chia mẫu';
  } else if (maCcdc == '01.02') {
    return 'Xiên lấy mẫu loại dài';
  } else if (maCcdc == '01.03') {
    return 'Bộ sàng thí nghiệm';
  } else if (maCcdc == '02.64') {
    return 'Máy hút khí';
  } else if (maCcdc == '02.65') {
    return 'Máy phun thuốc trừ sâu';
  } else if (maCcdc == '02.66') {
    return 'Quạt công nghiệp';
  } else if (maCcdc == '02.67') {
    return 'Máy khâu bao';
  } else if (maCcdc == '02.68') {
    return 'Bao PP';
  } else if (maCcdc == '02.03') {
    return 'Màng PVC';
  } else if (maCcdc == '03.01') {
    return 'Máy nạp ắc quy';
  }
}

export function NumberToRoman(num) {
  if (typeof num !== 'number')
    return false;

  var digits = String(+num).split(""),
    key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
      "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
      "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
    romanNum = "",
    i = 3;
  while (i--)
    romanNum = (key[+digits.pop() + (i * 10)] || "") + romanNum;
  return Array(+digits.join("") + 1).join("M") + romanNum;
}
export function convertTienTobangChuThapPhan(tien: number): string {
  if (tien > 0) {
    const phanNguyen = +tien.toString().split(".")[0];
    const phanThapPhan = +tien.toString().split(".")[1];
    return VNnum2words(phanNguyen) + (phanThapPhan ? " " + "phẩy" + " " + VNnum2words(phanThapPhan) : "");
  } else {
    return ''
  }
}