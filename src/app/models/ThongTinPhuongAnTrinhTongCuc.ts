import { ChiTietDuAn } from "./ChiTietDuAn";
import { ChiTietFile } from "./ChiTietFile";

export class ThongTinPhuongAnTrinhTongCuc {
  id: number;
  hthucLcnt: string;
  idThHdr: number;
  loaiHdong: string;
  loaiVthh: string;
  namKhoach: number;
  nguonVon: string;
  pthucLcnt: string;
  soPhAn: string;
  tgianDthau: string;
  tgianMthau: string;
  tgianNhang: string;
  tgianTbao: string;
  veViec: string;
  ghiChu: string;
  detail: Array<ChiTietDuAn>;
  fileDinhKems: Array<ChiTietFile>;
}
