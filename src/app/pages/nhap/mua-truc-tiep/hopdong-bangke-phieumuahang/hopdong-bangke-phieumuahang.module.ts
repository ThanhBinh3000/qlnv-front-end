import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainModule } from 'src/app/layout/main/main.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { HopdongBangkePhieumuahangComponent } from './hopdong-bangke-phieumuahang.component';
import { HopDongComponent } from './hop-dong/hop-dong.component';
import { HopdongPhulucHopdongComponent } from './hopdong-phuluc-hopdong/hopdong-phuluc-hopdong.component';
import { BangkeThumualeComponent } from './bangke-thumuale/bangke-thumuale.component';
import { ThemmoiHopdongPhulucComponent } from './hopdong-phuluc-hopdong/themmoi-hopdong-phuluc/themmoi-hopdong-phuluc.component';

@NgModule({
  declarations: [
    HopdongBangkePhieumuahangComponent,
    HopDongComponent,
    HopdongPhulucHopdongComponent,
    BangkeThumualeComponent,
    ThemmoiHopdongPhulucComponent,

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
  exports: [
    HopdongBangkePhieumuahangComponent
  ]
})
export class HopdongBangkePhieumuahangModule { }
