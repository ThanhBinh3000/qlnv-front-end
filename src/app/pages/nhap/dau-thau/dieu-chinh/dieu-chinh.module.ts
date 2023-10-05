import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DieuChinhComponent } from './dieu-chinh.component';
import { DieuchinhLuachonNhathauComponent } from './dieuchinh-luachon-nhathau/dieuchinh-luachon-nhathau.component';
import { ThemMoiDieuChinhComponent } from './dieuchinh-luachon-nhathau/themmoi-dieuchinh/themmoi-dieuchinh.component';
import { ThongtinDieuchinhComponent } from './dieuchinh-luachon-nhathau/themmoi-dieuchinh/thongtin-dieuchinh/thongtin-dieuchinh.component';
@NgModule({
  declarations: [
    DieuChinhComponent,
    DieuchinhLuachonNhathauComponent,
    ThemMoiDieuChinhComponent,
    ThongtinDieuchinhComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
  exports: [
    DieuChinhComponent,
    DieuchinhLuachonNhathauComponent,
  ]
})
export class DieuChinhModule { }
