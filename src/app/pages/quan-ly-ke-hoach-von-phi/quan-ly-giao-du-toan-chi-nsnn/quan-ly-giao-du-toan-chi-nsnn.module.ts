import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuanLyGiaoDuToanChiNSNNRoutingModule } from './quan-ly-giao-du-toan-chi-nsnn-routing.module';
import { QuanLyGiaoDuToanChiNSNNComponent } from './quan-ly-giao-du-toan-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [QuanLyGiaoDuToanChiNSNNComponent],
  imports: [CommonModule, QuanLyGiaoDuToanChiNSNNRoutingModule, ComponentsModule],
})
export class QuanLyDieuChinhDuToanChiNSNNModule {}
