import { ChiTietDuAn } from "./ChiTietDuAn";
import { ChiTietFile } from "./ChiTietFile";
import { ChiTietGoiThau } from "./ChiTietGoiThau";

export class ThongTinTongHopDeXuatLCNT {
  id: number;
  hthucLcnt: string;
  loaiHdong: string;
  loaiVthh: string;
  namKhoach: number;
  nguonVon: string;
  pthucLcnt: string;
  veViec: string;
  ghiChu: string;
  denTgianDthau: string;
  denTgianMthau: string;
  denTgianNhang: string;
  denTgianTbao: string;
  ngayTao: string;
  nguoiTao: string;
  phuongAn: string;
  tenHthucLcnt: string;
  tenLoaiHdong: string;
  tenLoaiVthh: string;
  tenNguonVon: string;
  tenPthucLcnt: string;
  tuTgianDthau: string;
  tuTgianMthau: string;
  tuTgianNhang: string;
  tuTgianTbao: string;
  children: Array<ChiTietGoiThau>;
}
