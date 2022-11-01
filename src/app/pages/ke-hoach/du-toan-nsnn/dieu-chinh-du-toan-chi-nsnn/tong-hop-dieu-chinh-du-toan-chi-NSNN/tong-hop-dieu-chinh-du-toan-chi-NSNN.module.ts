import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopDieuChinhDuToanChiNSNNRoutingModule } from './tong-hop-dieu-chinh-du-toan-chi-NSNN-routing.module';
import { TongHopDieuChinhDuToanChiNSNNComponent } from './tong-hop-dieu-chinh-du-toan-chi-NSNN.component';

@NgModule({
  declarations: [
    TongHopDieuChinhDuToanChiNSNNComponent,
  ],
  imports: [
    CommonModule,
    TongHopDieuChinhDuToanChiNSNNRoutingModule,
    ComponentsModule,
  ],
  exports: [
    TongHopDieuChinhDuToanChiNSNNComponent,
  ]
})

export class TongHopDieuChinhDuToanChiNSNNModule { }
