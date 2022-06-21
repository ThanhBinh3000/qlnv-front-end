import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DieuChinhComponent } from './dieu-chinh.component';
import { DieuchinhLuachonNhathauComponent } from './dieuchinh-luachon-nhathau/dieuchinh-luachon-nhathau.component';
import { ThemMoiDieuChinhComponent } from './dieuchinh-luachon-nhathau/themmoi-dieuchinh/themmoi-dieuchinh.component';
@NgModule({
  declarations: [
    DieuChinhComponent,
    DieuchinhLuachonNhathauComponent,
    ThemMoiDieuChinhComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
  exports: [
    DieuChinhComponent
  ]
})
export class DieuChinhModule { }
