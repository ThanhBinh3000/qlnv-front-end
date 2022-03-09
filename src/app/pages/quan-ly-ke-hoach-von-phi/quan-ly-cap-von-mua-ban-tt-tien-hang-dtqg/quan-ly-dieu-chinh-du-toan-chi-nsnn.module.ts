import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuanLyDieuChinhDuToanChiNSNNRoutingModule } from './quan-ly-dieu-chinh-du-toan-chi-nsnn-routing.module';
import { QuanLyDieuChinhDuToanChiNSNNComponent } from './quan-ly-dieu-chinh-du-toan-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [QuanLyDieuChinhDuToanChiNSNNComponent],
  imports: [CommonModule, QuanLyDieuChinhDuToanChiNSNNRoutingModule, ComponentsModule],
})
export class QuanLyDieuChinhDuToanChiNSNNModule {}
