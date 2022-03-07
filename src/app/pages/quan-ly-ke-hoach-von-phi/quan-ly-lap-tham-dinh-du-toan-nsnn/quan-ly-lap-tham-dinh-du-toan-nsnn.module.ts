import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuanLyLapThamDinhDuToanNSNNRoutingModule } from './quan-ly-lap-tham-dinh-du-toan-nsnn-routing.module';
import { QuanLyLapThamDinhDuToanNSNNComponent } from './quan-ly-lap-tham-dinh-du-toan-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [QuanLyLapThamDinhDuToanNSNNComponent],
  imports: [CommonModule, QuanLyLapThamDinhDuToanNSNNRoutingModule, ComponentsModule],
})
export class QuanLyLapThamDinhDuToanNSNNModule {}
