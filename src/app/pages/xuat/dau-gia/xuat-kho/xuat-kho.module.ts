import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhieuXuatKhoComponent } from './phieu-xuat-kho/phieu-xuat-kho.component';
import { MainXuatKhoComponent } from './main-xuat-kho/main-xuat-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BienBanTinhKhoComponent } from './bien-ban-tinh-kho/bien-ban-tinh-kho.component';
import { BangKeCanComponent } from './bang-ke-can/bang-ke-can.component';
import { BienBanHaoDoiComponent } from './bien-ban-hao-doi/bien-ban-hao-doi.component';
import { ThemMoiBienBanTinhKhoComponent } from './bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component';
import { ThemMoiBienBanHaoDoiComponent } from './bien-ban-hao-doi/them-moi-bien-ban-hao-doi/them-moi-bien-ban-hao-doi.component';
import { ThemMoiPhieuXuatKhoComponent } from './phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component';
import { XuatKhoComponent } from './xuat-kho.component';
import {CuuTroVienTroModule} from "../../xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.module";



@NgModule({
  // declarations: [
  //   MainXuatKhoComponent,
  //   PhieuXuatKhoComponent,
  //   ThemMoiPhieuXuatKhoComponent,
  //   BangKeCanComponent,
  //   BienBanTinhKhoComponent,
  //   ThemMoiBienBanTinhKhoComponent,
  //   BienBanHaoDoiComponent,
  //   ThemMoiBienBanHaoDoiComponent,
  //   XuatKhoComponent
  // ],
  // imports: [
  //   CommonModule,
  //   ComponentsModule,
  //   DirectivesModule,
  //   BangKeCanModule,
  //   CuuTroVienTroModule,
  // ],
  //   exports: [
  //       XuatKhoComponent,
  //       ThemMoiBienBanHaoDoiComponent,
  //   ]
})
export class XuatKhoModule { }
