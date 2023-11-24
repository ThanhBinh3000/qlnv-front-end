import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeXuatComponent} from './de-xuat/de-xuat.component';
import {TongHopComponent} from './tong-hop/tong-hop.component';
import {QuyetDinhComponent} from './quyet-dinh/quyet-dinh.component';
import {MainKeHoachBanDauGiaComponent} from './main-ke-hoach-ban-dau-gia/main-ke-hoach-ban-dau-gia.component';
import {ComponentsModule} from "../../../../components/components.module";
import {MainModule} from "../../../../layout/main/main.module";
import {
  ThemDeXuatKeHoachBanDauGiaComponent
} from './de-xuat/them-de-xuat-ke-hoach-ban-dau-gia/them-de-xuat-ke-hoach-ban-dau-gia.component';
import {
  ThemMoiTongHopKeHoachBanDauGiaComponent
} from './tong-hop/them-moi-tong-hop-ke-hoach-ban-dau-gia/them-moi-tong-hop-ke-hoach-ban-dau-gia.component';
import {
  ThemQuyetDinhBanDauGiaComponent
} from './quyet-dinh/them-quyet-dinh-ban-dau-gia/them-quyet-dinh-ban-dau-gia.component';
import {
  ThongtinDexuatKhbdgComponent
} from './quyet-dinh/them-quyet-dinh-ban-dau-gia/thongtin-dexuat-khbdg/thongtin-dexuat-khbdg.component';
import {
  KeHoachVonDauNamModule
} from "../../../ke-hoach/giao-ke-hoach-va-du-toan/ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module";
import {DieuChinhComponent} from './dieu-chinh/dieu-chinh.component';
import {ThemMoiDieuChinhComponent} from './dieu-chinh/them-moi-dieu-chinh/them-moi-dieu-chinh.component';
import {
  ThongTinDieuChinhComponent
} from './dieu-chinh/them-moi-dieu-chinh/thong-tin-dieu-chinh/thong-tin-dieu-chinh.component';


@NgModule({
  declarations: [
    DeXuatComponent,
    TongHopComponent,
    QuyetDinhComponent,
    MainKeHoachBanDauGiaComponent,
    ThemDeXuatKeHoachBanDauGiaComponent,
    ThemMoiTongHopKeHoachBanDauGiaComponent,
    ThemQuyetDinhBanDauGiaComponent,
    ThongtinDexuatKhbdgComponent,
    DieuChinhComponent,
    ThemMoiDieuChinhComponent,
    ThongTinDieuChinhComponent
  ],
  exports: [
    DeXuatComponent,
    MainKeHoachBanDauGiaComponent,
    ThemQuyetDinhBanDauGiaComponent,
    ThemMoiDieuChinhComponent,
    ThemDeXuatKeHoachBanDauGiaComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    KeHoachVonDauNamModule,
  ]
})
export class KeHoachBanDauGiaModule {
}
