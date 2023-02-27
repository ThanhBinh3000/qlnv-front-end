import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhieuXuatKhoComponent } from './phieu-xuat-kho/phieu-xuat-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MainXuatKhoComponent } from './main-xuat-kho/main-xuat-kho.component';
import { BangKeCanComponent } from './bang-ke-can/bang-ke-can.component';
import { BangKeCanModule } from "./bang-ke-can/bang-ke-can.module";
import { ThemMoiPhieuXuatKhoComponent } from './phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component';
import { BienBanTinhKhoComponent } from './bien-ban-tinh-kho/bien-ban-tinh-kho.component';
import { ThemMoiBienBanTinhKhoComponent } from './bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component';



@NgModule({
  declarations: [
    MainXuatKhoComponent,
    PhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BangKeCanComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    BangKeCanModule,
  ],
  exports: [
    MainXuatKhoComponent,
  ]
})
export class XuatKhoModule { }
