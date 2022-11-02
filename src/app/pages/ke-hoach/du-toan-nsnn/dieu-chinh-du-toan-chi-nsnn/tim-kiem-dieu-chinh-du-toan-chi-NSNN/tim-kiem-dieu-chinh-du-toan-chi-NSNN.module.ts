import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TimKiemDieuChinhDuToanChiNSNNRoutingModule } from './tim-kiem-dieu-chinh-du-toan-chi-NSNN-routing.module';
import { TimKiemDieuChinhDuToanChiNSNNComponent } from './tim-kiem-dieu-chinh-du-toan-chi-NSNN.component';


@NgModule({
  declarations: [
    TimKiemDieuChinhDuToanChiNSNNComponent,
  ],
  imports: [
    CommonModule,
    TimKiemDieuChinhDuToanChiNSNNRoutingModule,
    ComponentsModule,
  ],
  exports: [
    TimKiemDieuChinhDuToanChiNSNNComponent,
  ]
})

export class TimKiemDieuChinhDuToanChiNSNNModule { }
