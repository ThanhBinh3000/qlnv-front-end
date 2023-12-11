import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {XuatKhoBttComponent} from './xuat-kho-btt.component';
import {MainXuatKhoBttComponent} from './main-xuat-kho-btt/main-xuat-kho-btt.component';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {PhieuXuatKhoBttComponent} from './phieu-xuat-kho-btt/phieu-xuat-kho-btt.component';
import {
  ThemMoiPhieuXuatKhoBttComponent
} from './phieu-xuat-kho-btt/them-moi-phieu-xuat-kho-btt/them-moi-phieu-xuat-kho-btt.component';
import {BangCanKeHangBttComponent} from './bang-can-ke-hang-btt/bang-can-ke-hang-btt.component';
import {
  ThemMoiBangKeCanHangBttComponent
} from './bang-can-ke-hang-btt/them-moi-bang-ke-can-hang-btt/them-moi-bang-ke-can-hang-btt.component';
import {BienBanTinhKhoBttComponent} from './bien-ban-tinh-kho-btt/bien-ban-tinh-kho-btt.component';
import {
  ThemMoiBienBanTinhKhoComponent
} from './bien-ban-tinh-kho-btt/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component';
import {BienBanHaoDoiBttComponent} from './bien-ban-hao-doi-btt/bien-ban-hao-doi-btt.component';
import {
  ThemMoiBienBanHaoDoiBttComponent
} from './bien-ban-hao-doi-btt/them-moi-bien-ban-hao-doi-btt/them-moi-bien-ban-hao-doi-btt.component';
import {KiemTraCluongBttModule} from '../kiem-tra-cluong-btt/kiem-tra-cluong-btt.module';
import {GiaoNvXuatHangBttModule} from "../giao-nv-xuat-hang-btt/giao-nv-xuat-hang-btt.module";


@NgModule({
  declarations: [
    XuatKhoBttComponent,
    MainXuatKhoBttComponent,
    PhieuXuatKhoBttComponent,
    ThemMoiPhieuXuatKhoBttComponent,
    BangCanKeHangBttComponent,
    ThemMoiBangKeCanHangBttComponent,
    BienBanTinhKhoBttComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiBttComponent,
    ThemMoiBienBanHaoDoiBttComponent,
  ],
  imports: [
    KiemTraCluongBttModule,
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    GiaoNvXuatHangBttModule,
  ],
  exports: [
    XuatKhoBttComponent,
  ]
})
export class XuatKhoBttModule {
}
