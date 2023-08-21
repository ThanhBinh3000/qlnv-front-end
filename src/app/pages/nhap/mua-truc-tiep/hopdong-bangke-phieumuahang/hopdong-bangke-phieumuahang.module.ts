import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainModule } from 'src/app/layout/main/main.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { HopdongBangkePhieumuahangComponent } from './hopdong-bangke-phieumuahang.component';
import { HopDongComponent } from './hop-dong/hop-dong.component';
import { HopdongPhulucHopdongComponent } from './hopdong-phuluc-hopdong/hopdong-phuluc-hopdong.component';
import { BangkeThumualeComponent } from './bangke-thumuale/bangke-thumuale.component';
import { ThemmoiHopdongPhulucComponent } from './hopdong-phuluc-hopdong/themmoi-hopdong-phuluc/themmoi-hopdong-phuluc.component';
import { QuanLyHopDongMttComponent } from './hopdong-phuluc-hopdong/quan-ly-hop-dong-mtt/quan-ly-hop-dong-mtt.component';
import { PhuLucMttComponent } from './hopdong-phuluc-hopdong/phu-luc-mtt/phu-luc-mtt.component';

@NgModule({
  declarations: [
    HopdongBangkePhieumuahangComponent,
    HopDongComponent,
    HopdongPhulucHopdongComponent,
    BangkeThumualeComponent,
    ThemmoiHopdongPhulucComponent,
    QuanLyHopDongMttComponent,
    PhuLucMttComponent,

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
    exports: [
        HopdongBangkePhieumuahangComponent,
        ThemmoiHopdongPhulucComponent
    ]
})
export class HopdongBangkePhieumuahangModule { }
