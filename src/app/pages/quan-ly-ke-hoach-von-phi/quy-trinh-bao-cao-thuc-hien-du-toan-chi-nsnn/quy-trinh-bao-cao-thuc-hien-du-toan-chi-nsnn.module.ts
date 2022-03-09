import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuyTrinhBaoCaoThucHienDuToanChiNSNNRoutingModule } from './quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn-routing.module';
import { QuyTrinhBaoCaoThucHienDuToanChiNSNNComponent } from './quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [QuyTrinhBaoCaoThucHienDuToanChiNSNNComponent],
  imports: [CommonModule, QuyTrinhBaoCaoThucHienDuToanChiNSNNRoutingModule, ComponentsModule],
})
export class QuanLyDieuChinhDuToanChiNSNNModule {}
