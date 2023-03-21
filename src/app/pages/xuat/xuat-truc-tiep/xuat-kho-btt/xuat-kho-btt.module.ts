import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XuatKhoBttComponent } from './xuat-kho-btt.component';
import { MainXuatKhoBttComponent } from './main-xuat-kho-btt/main-xuat-kho-btt.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PhieuXuatKhoBttComponent } from './phieu-xuat-kho-btt/phieu-xuat-kho-btt.component';
import { ThemMoiPhieuXuatKhoBttComponent } from './phieu-xuat-kho-btt/them-moi-phieu-xuat-kho-btt/them-moi-phieu-xuat-kho-btt.component';



@NgModule({
  declarations: [
    XuatKhoBttComponent,
    MainXuatKhoBttComponent,
    PhieuXuatKhoBttComponent,
    ThemMoiPhieuXuatKhoBttComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    XuatKhoBttComponent,
  ]
})
export class XuatKhoBttModule { }
