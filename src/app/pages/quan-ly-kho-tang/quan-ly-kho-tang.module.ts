import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {MainModule} from 'src/app/layout/main/main.module';
import {QuanLyKhoTangRoutingModule} from './quan-ly-kho-tang-routing.module';
import {QuanLyKhoTangComponent} from './quan-ly-kho-tang.component';
import {MangLuoiKhoComponent} from './mang-luoi-kho/mang-luoi-kho.component';
import {KeHoachComponent} from './ke-hoach/ke-hoach.component';
import {QuyHoachKhoComponent} from './ke-hoach/quy-hoach-kho/quy-hoach-kho.component';
import {
  KeHoachXayDungTrungHanComponent
} from './ke-hoach/ke-hoach-xay-dung-trung-han/ke-hoach-xay-dung-trung-han.component';
import {
  KeHoachXayDungHangNamComponent
} from './ke-hoach/ke-hoach-xay-dung-hang-nam/ke-hoach-xay-dung-hang-nam.component';
import {
  KeHoachSuaChuaHangNamComponent
} from './ke-hoach/ke-hoach-sua-chua-hang-nam/ke-hoach-sua-chua-hang-nam.component';
import {QuyetDinhQuyHoachComponent} from './ke-hoach/quy-hoach-kho/quyet-dinh-quy-hoach/quyet-dinh-quy-hoach.component';
import {
  QuyetDinhDieuChinhQuyHoachComponent
} from './ke-hoach/quy-hoach-kho/quyet-dinh-dieu-chinh-quy-hoach/quyet-dinh-dieu-chinh-quy-hoach.component';
import {
  DeXuatKeHoachComponent
} from './ke-hoach/ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/de-xuat-ke-hoach.component';
import {
  TongHopDeXuatKeHoachComponent
} from './ke-hoach/ke-hoach-xay-dung-trung-han/tong-hop-de-xuat-ke-hoach/tong-hop-de-xuat-ke-hoach.component';
import {
  QuyetDinhPheDuyetKeHoachComponent
} from './ke-hoach/ke-hoach-xay-dung-trung-han/quyet-dinh-phe-duyet-ke-hoach/quyet-dinh-phe-duyet-ke-hoach.component';
import {DeXuatNhuCauComponent} from './ke-hoach/ke-hoach-xay-dung-hang-nam/de-xuat-nhu-cau/de-xuat-nhu-cau.component';
import {
  TongHopDxNhuCauComponent
} from './ke-hoach/ke-hoach-xay-dung-hang-nam/tong-hop-dx-nhu-cau/tong-hop-dx-nhu-cau.component';
import {
  QuyetDinhPheDuyetKhxdComponent
} from './ke-hoach/ke-hoach-xay-dung-hang-nam/quyet-dinh-phe-duyet-khxd/quyet-dinh-phe-duyet-khxd.component';
import {ThemMoiQdComponent} from "./ke-hoach/quy-hoach-kho/quyet-dinh-quy-hoach/them-moi-qd/them-moi-qd.component";
import {
  ThemMoiQdDcComponent
} from "./ke-hoach/quy-hoach-kho/quyet-dinh-dieu-chinh-quy-hoach/them-moi-qd-dc/them-moi-qd-dc.component";
import {
  ThemMoiDxkhTrungHanComponent
} from "./ke-hoach/ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/them-moi-dxkh-trung-han/them-moi-dxkh-trung-han.component";
import {
  ThemMoiTongHopKhxdTrungHanComponent
} from "./ke-hoach/ke-hoach-xay-dung-trung-han/tong-hop-de-xuat-ke-hoach/them-moi-tong-hop-khxd-trung-han/them-moi-tong-hop-khxd-trung-han.component";
import {
  ThemMoiQdPheDuyetComponent
} from "./ke-hoach/ke-hoach-xay-dung-trung-han/quyet-dinh-phe-duyet-ke-hoach/them-moi-qd-phe-duyet/them-moi-qd-phe-duyet.component";
import {
  ThemMoiDxNhuCauComponent
} from "./ke-hoach/ke-hoach-xay-dung-hang-nam/de-xuat-nhu-cau/them-moi-dx-nhu-cau/them-moi-dx-nhu-cau.component";
import {
  ThemMoiQdPdDxNhuCauComponent
} from "./ke-hoach/ke-hoach-xay-dung-hang-nam/quyet-dinh-phe-duyet-khxd/them-moi-qd-pd-dx-nhu-cau/them-moi-qd-pd-dx-nhu-cau.component";
import {
  ThemMoiTongHopDxNhuCauComponent
} from "./ke-hoach/ke-hoach-xay-dung-hang-nam/tong-hop-dx-nhu-cau/them-moi-tong-hop-dx-nhu-cau/them-moi-tong-hop-dx-nhu-cau.component";
import {ThemMoiKhoComponent} from './mang-luoi-kho/them-moi-kho/them-moi-kho.component';
import {DanhMucDuAnComponent} from "./ke-hoach/dm-du-an-cong-trinh/danh-muc-du-an/danh-muc-du-an.component";
import {
  DeXuatKhScLonComponent
} from "./ke-hoach/ke-hoach-sua-chua-hang-nam/de-xuat-kh-sc-lon/de-xuat-kh-sc-lon.component";
import {
  QuyetDinhScLonBtcComponent
} from "./ke-hoach/ke-hoach-sua-chua-hang-nam/quyet-dinh-sc-lon-btc/quyet-dinh-sc-lon-btc.component";
import {
  QuyetDinhScLonTcdtComponent
} from "./ke-hoach/ke-hoach-sua-chua-hang-nam/quyet-dinh-sc-lon-tcdt/quyet-dinh-sc-lon-tcdt.component";
import {
  ThemMoiScLonComponent
} from './ke-hoach/ke-hoach-sua-chua-hang-nam/de-xuat-kh-sc-lon/them-moi-sc-lon/them-moi-sc-lon.component';
import {
  ThemMoiQdScBtcComponent
} from "./ke-hoach/ke-hoach-sua-chua-hang-nam/quyet-dinh-sc-lon-btc/them-moi-qd-sc-btc/them-moi-qd-sc-btc.component";
import {TienDoXayDungSuaChuaComponent} from './tien-do-xay-dung-sua-chua/tien-do-xay-dung-sua-chua.component';
import {TinhHinhSuDungComponent} from './tinh-hinh-su-dung/tinh-hinh-su-dung.component';
import {
  TienDoDauTuXayDungComponent
} from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/tien-do-dau-tu-xay-dung.component';
import {TienDoSuaChuaLonHangNamComponent} from './tien-do-xay-dung-sua-chua/tien-do-sua-chua-lon-hang-nam/tien-do-sua-chua-lon-hang-nam.component';
import {DmDuAnCongTrinhComponent} from "./ke-hoach/dm-du-an-cong-trinh/dm-du-an-cong-trinh.component";
import {DanhMucScLonComponent} from "./ke-hoach/dm-du-an-cong-trinh/danh-muc-sc-lon/danh-muc-sc-lon.component";
import {
  DanhMucScThuongXuyenComponent
} from "./ke-hoach/dm-du-an-cong-trinh/danh-muc-sc-thuong-xuyen/danh-muc-sc-thuong-xuyen.component";
import {
  ThongTinDmScLonComponent
} from './ke-hoach/dm-du-an-cong-trinh/danh-muc-sc-lon/thong-tin-dm-sc-lon/thong-tin-dm-sc-lon.component';
import {
  QuyetDinhPheDuyetDuAnDtxdComponent
} from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/quyet-dinh-phe-duyet-du-an-dtxd/quyet-dinh-phe-duyet-du-an-dtxd.component';
import {
  ThongTinQuyetDinhPheDuyetDuAnDtxdComponent
} from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/quyet-dinh-phe-duyet-du-an-dtxd/thong-tin-quyet-dinh-phe-duyet-du-an-dtxd/thong-tin-quyet-dinh-phe-duyet-du-an-dtxd.component';
import {
  ThongTinDanhMucScThuongXuyenComponent
} from './ke-hoach/dm-du-an-cong-trinh/danh-muc-sc-thuong-xuyen/thong-tin-danh-muc-sc-thuong-xuyen/thong-tin-danh-muc-sc-thuong-xuyen.component';
import {
  QuyetDinhPheDuyetTktcTdtComponent
} from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/quyet-dinh-phe-duyet-tktc-tdt/quyet-dinh-phe-duyet-tktc-tdt.component';
import {
  ThongTinQuyetDinhPheDuyetTktcTdtComponent
} from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/quyet-dinh-phe-duyet-tktc-tdt/thong-tin-quyet-dinh-phe-duyet-tktc-tdt/thong-tin-quyet-dinh-phe-duyet-tktc-tdt.component';
import {
  QdThongBaoSuaChuaLonComponent
} from "./ke-hoach/ke-hoach-sua-chua-hang-nam/qd-thong-bao-sua-chua-lon/qd-thong-bao-sua-chua-lon.component";
import {
  ThemMoiScTcdtComponent
} from "./ke-hoach/ke-hoach-sua-chua-hang-nam/quyet-dinh-sc-lon-tcdt/them-moi-sc-tcdt/them-moi-sc-tcdt.component";
import { QuyetDinhPheDuyetKhlcntComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/quyet-dinh-phe-duyet-khlcnt/quyet-dinh-phe-duyet-khlcnt.component';
import { ThongTinQuyetDinhPheDuyetKhlcntComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/quyet-dinh-phe-duyet-khlcnt/thong-tin-quyet-dinh-phe-duyet-khlcnt/thong-tin-quyet-dinh-phe-duyet-khlcnt.component';
import { ToChucTrienKhaiLuaChonNhaThauComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/to-chuc-trien-khai-lua-chon-nha-thau/to-chuc-trien-khai-lua-chon-nha-thau.component';
import { ThongTinDauThauComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/to-chuc-trien-khai-lua-chon-nha-thau/thong-tin-dau-thau/thong-tin-dau-thau.component';
import { QuyetDinhPheDuyetKqlcntComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/to-chuc-trien-khai-lua-chon-nha-thau/quyet-dinh-phe-duyet-kqlcnt/quyet-dinh-phe-duyet-kqlcnt.component';
import { CapNhatThongTinDauThauComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/to-chuc-trien-khai-lua-chon-nha-thau/thong-tin-dau-thau/cap-nhat-thong-tin-dau-thau/cap-nhat-thong-tin-dau-thau.component';
import { ThongTinQuyetDinhPheDuyetKqlcntComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/to-chuc-trien-khai-lua-chon-nha-thau/quyet-dinh-phe-duyet-kqlcnt/thong-tin-quyet-dinh-phe-duyet-kqlcnt/thong-tin-quyet-dinh-phe-duyet-kqlcnt.component';
import { HopDongComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/hop-dong/hop-dong.component';
import { ThongTinHopDongComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/hop-dong/thong-tin-hop-dong/thong-tin-hop-dong.component';
import { ThemMoiHopDongComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/hop-dong/thong-tin-hop-dong/them-moi-hop-dong/them-moi-hop-dong.component';
import { PhuLucHopDongComponent } from './tien-do-xay-dung-sua-chua/tien-do-dau-tu-xay-dung/hop-dong/thong-tin-hop-dong/phu-luc-hop-dong/phu-luc-hop-dong.component';
import {
  ThemMoiThongBaoScLonComponent
} from "./ke-hoach/ke-hoach-sua-chua-hang-nam/qd-thong-bao-sua-chua-lon/them-moi-thong-bao-sc-lon/them-moi-thong-bao-sc-lon.component";
import {
  KeHoachSuaChuaThuongXuyenComponent
} from "./ke-hoach/ke-hoach-sua-chua-thuong-xuyen/ke-hoach-sua-chua-thuong-xuyen.component";
import { TongHopKhSuaChuaThuongXuyenComponent } from './ke-hoach/ke-hoach-sua-chua-thuong-xuyen/tong-hop-kh-sua-chua-thuong-xuyen/tong-hop-kh-sua-chua-thuong-xuyen.component';
import { QuyetDinhPheDuyetKeHoachDanhMucComponent } from './ke-hoach/ke-hoach-sua-chua-thuong-xuyen/quyet-dinh-phe-duyet-ke-hoach-danh-muc/quyet-dinh-phe-duyet-ke-hoach-danh-muc.component';
import { DeXuatKeHoachSuaChuaThuongXuyenComponent } from './ke-hoach/ke-hoach-sua-chua-thuong-xuyen/de-xuat-ke-hoach-sua-chua-thuong-xuyen/de-xuat-ke-hoach-sua-chua-thuong-xuyen.component';
import { ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent } from './ke-hoach/ke-hoach-sua-chua-thuong-xuyen/de-xuat-ke-hoach-sua-chua-thuong-xuyen/thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen/thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen.component';
import { DialogThemMoiDxkhthComponent } from './ke-hoach/ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/them-moi-dxkh-trung-han/dialog-them-moi-dxkhth/dialog-them-moi-dxkhth.component';
import { ThemMoiDanhMucDuAnKhoComponent } from './ke-hoach/dm-du-an-cong-trinh/danh-muc-du-an/them-moi-danh-muc-du-an-kho/them-moi-danh-muc-du-an-kho.component';
import { DialogThemMoiKehoachDanhmucChitietComponent } from './ke-hoach/ke-hoach-sua-chua-thuong-xuyen/de-xuat-ke-hoach-sua-chua-thuong-xuyen/thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen/dialog-them-moi-kehoach-danhmuc-chitiet/dialog-them-moi-kehoach-danhmuc-chitiet.component';
import { ThongTinTongHopKhSuaChuaThuongXuyenComponent } from './ke-hoach/ke-hoach-sua-chua-thuong-xuyen/tong-hop-kh-sua-chua-thuong-xuyen/thong-tin-tong-hop-kh-sua-chua-thuong-xuyen/thong-tin-tong-hop-kh-sua-chua-thuong-xuyen.component';
import { ThongTinQuyetDinhPheDuyetKeHoacDanhMucComponent } from './ke-hoach/ke-hoach-sua-chua-thuong-xuyen/quyet-dinh-phe-duyet-ke-hoach-danh-muc/thong-tin-quyet-dinh-phe-duyet-ke-hoac-danh-muc/thong-tin-quyet-dinh-phe-duyet-ke-hoac-danh-muc.component';
import { TienDoSuaChuaThuongXuyenComponent } from './tien-do-xay-dung-sua-chua/tien-do-sua-chua-thuong-xuyen/tien-do-sua-chua-thuong-xuyen.component';
import { DialogDxScLonComponent } from './ke-hoach/ke-hoach-sua-chua-hang-nam/de-xuat-kh-sc-lon/them-moi-sc-lon/dialog-dx-sc-lon/dialog-dx-sc-lon.component';


@NgModule({
  declarations: [
    QuanLyKhoTangComponent,
    MangLuoiKhoComponent,
    KeHoachComponent,
    QuyHoachKhoComponent,
    KeHoachXayDungTrungHanComponent,
    KeHoachXayDungHangNamComponent,
    KeHoachSuaChuaHangNamComponent,
    QuyetDinhQuyHoachComponent,
    QuyetDinhDieuChinhQuyHoachComponent,
    DeXuatKeHoachComponent,
    TongHopDeXuatKeHoachComponent,
    QuyetDinhPheDuyetKeHoachComponent,
    DeXuatNhuCauComponent,
    TongHopDxNhuCauComponent,
    QuyetDinhPheDuyetKhxdComponent,
    ThemMoiQdComponent,
    ThemMoiQdDcComponent,
    ThemMoiDxkhTrungHanComponent,
    ThemMoiTongHopKhxdTrungHanComponent,
    ThemMoiQdPheDuyetComponent,
    ThemMoiDxNhuCauComponent,
    ThemMoiQdPdDxNhuCauComponent,
    ThemMoiTongHopDxNhuCauComponent,
    ThemMoiKhoComponent,
    DanhMucDuAnComponent,
    DeXuatKhScLonComponent,
    QuyetDinhScLonBtcComponent,
    QuyetDinhScLonTcdtComponent,
    ThemMoiScLonComponent,
    ThemMoiScLonComponent,
    ThemMoiQdScBtcComponent,
    ThemMoiScTcdtComponent,
    TienDoXayDungSuaChuaComponent,
    TinhHinhSuDungComponent,
    TienDoDauTuXayDungComponent,
    TienDoSuaChuaLonHangNamComponent,
    DmDuAnCongTrinhComponent,
    DanhMucScLonComponent,
    DanhMucScThuongXuyenComponent,
    ThongTinDmScLonComponent,
    QuyetDinhPheDuyetDuAnDtxdComponent,
    ThongTinQuyetDinhPheDuyetDuAnDtxdComponent,
    ThongTinDanhMucScThuongXuyenComponent,
    QuyetDinhPheDuyetTktcTdtComponent,
    ThongTinQuyetDinhPheDuyetTktcTdtComponent,
    QdThongBaoSuaChuaLonComponent,
    QuyetDinhPheDuyetKhlcntComponent,
    ThongTinQuyetDinhPheDuyetKhlcntComponent,
    ToChucTrienKhaiLuaChonNhaThauComponent,
    ThongTinDauThauComponent,
    QuyetDinhPheDuyetKqlcntComponent,
    CapNhatThongTinDauThauComponent,
    ThongTinQuyetDinhPheDuyetKqlcntComponent,
    HopDongComponent,
    ThongTinHopDongComponent,
    ThemMoiHopDongComponent,
    PhuLucHopDongComponent,
    ThemMoiThongBaoScLonComponent,
    KeHoachSuaChuaThuongXuyenComponent,
    TongHopKhSuaChuaThuongXuyenComponent,
    QuyetDinhPheDuyetKeHoachDanhMucComponent,
    DeXuatKeHoachSuaChuaThuongXuyenComponent,
    ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent,
    DialogThemMoiDxkhthComponent,
    DialogThemMoiKehoachDanhmucChitietComponent,
    ThemMoiDanhMucDuAnKhoComponent,
    ThemMoiTongHopDxNhuCauComponent,
    ThongTinTongHopKhSuaChuaThuongXuyenComponent,
    ThemMoiQdPdDxNhuCauComponent,
    ThongTinQuyetDinhPheDuyetKeHoacDanhMucComponent,
    TienDoSuaChuaThuongXuyenComponent,
    DialogDxScLonComponent,
    ThongTinQuyetDinhPheDuyetKeHoacDanhMucComponent
  ],
  imports: [CommonModule, QuanLyKhoTangRoutingModule, ComponentsModule, MainModule],
})
export class QuanLyKhoTangModule {
}
