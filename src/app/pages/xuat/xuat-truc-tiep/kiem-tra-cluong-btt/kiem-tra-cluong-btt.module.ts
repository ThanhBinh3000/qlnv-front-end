import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {KiemTraCluongBttComponent} from './kiem-tra-cluong-btt.component';
import {MainKtraCluongBttComponent} from './main-ktra-cluong-btt/main-ktra-cluong-btt.component';
import {BienBanLayMauBttComponent} from './bien-ban-lay-mau-btt/bien-ban-lay-mau-btt.component';
import {
  ThemMoiBienBanLayMauBttComponent
} from './bien-ban-lay-mau-btt/them-moi-bien-ban-lay-mau-btt/them-moi-bien-ban-lay-mau-btt.component';
import {PhieuKtraCluongBttComponent} from './phieu-ktra-cluong-btt/phieu-ktra-cluong-btt.component';
import {
  ThemPhieuKtraCluongBttComponent
} from './phieu-ktra-cluong-btt/them-phieu-ktra-cluong-btt/them-phieu-ktra-cluong-btt.component';
import {GiaoNvXuatHangBttModule} from '../giao-nv-xuat-hang-btt/giao-nv-xuat-hang-btt.module';
import {
  ThemDaiDienComponent
} from './bien-ban-lay-mau-btt/them-moi-bien-ban-lay-mau-btt/them-dai-dien/them-dai-dien.component';
import {
  HoSoKyThuatComponent
} from "src/app/pages/xuat/xuat-truc-tiep/kiem-tra-cluong-btt/ho-so-ky-thuat-btt/ho-so-ky-thuat.component";
import {
  ChiTietHoSoKyThuatComponent
} from "src/app/pages/xuat/xuat-truc-tiep/kiem-tra-cluong-btt/ho-so-ky-thuat-btt/chi-tiet-ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat.component";
import {
  ChiTietBienBanKiemTraComponent
} from "src/app/pages/xuat/xuat-truc-tiep/kiem-tra-cluong-btt/ho-so-ky-thuat-btt/chi-tiet-ho-so-ky-thuat/chi-tiet-bien-ban-kiem-tra/chi-tiet-bien-ban-kiem-tra.component";

@NgModule({
  declarations: [
    KiemTraCluongBttComponent,
    MainKtraCluongBttComponent,
    BienBanLayMauBttComponent,
    ThemMoiBienBanLayMauBttComponent,
    PhieuKtraCluongBttComponent,
    ThemPhieuKtraCluongBttComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChiTietBienBanKiemTraComponent,
    ThemDaiDienComponent,
  ],
  imports: [
    GiaoNvXuatHangBttModule,
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    KiemTraCluongBttComponent,
    ThemPhieuKtraCluongBttComponent,

  ]
})
export class KiemTraCluongBttModule {
}
