import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapBaoCaoDieuChinhDuToanChiNsnnRoutingModule } from './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn-routing.module';
import { LapBaoCaoDieuChinhDuToanChiNsnnComponent } from './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    LapBaoCaoDieuChinhDuToanChiNsnnComponent,
  ],
  imports: [
    CommonModule,
    LapBaoCaoDieuChinhDuToanChiNsnnRoutingModule,
    ComponentsModule,
  ],
})

export class LapBaoCaoDieuChinhDuToanChiNsnnModule {}
