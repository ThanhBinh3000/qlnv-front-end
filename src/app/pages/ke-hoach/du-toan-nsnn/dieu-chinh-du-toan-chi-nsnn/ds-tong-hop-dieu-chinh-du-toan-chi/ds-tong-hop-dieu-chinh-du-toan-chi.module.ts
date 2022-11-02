import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsTongHopDieuChinhDuToanChiRoutingModule } from './ds-tong-hop-dieu-chinh-du-toan-chi-routing.module';
import { DsTongHopDieuChinhDuToanChiComponent } from './ds-tong-hop-dieu-chinh-du-toan-chi.component';


@NgModule({
  declarations: [
    DsTongHopDieuChinhDuToanChiComponent,
  ],
  imports: [
    CommonModule,
    DsTongHopDieuChinhDuToanChiRoutingModule,
    ComponentsModule,
  ],
  exports: [
    DsTongHopDieuChinhDuToanChiComponent,
  ]
})

export class DsTongHopDieuChinhDuToanChiModule { }
