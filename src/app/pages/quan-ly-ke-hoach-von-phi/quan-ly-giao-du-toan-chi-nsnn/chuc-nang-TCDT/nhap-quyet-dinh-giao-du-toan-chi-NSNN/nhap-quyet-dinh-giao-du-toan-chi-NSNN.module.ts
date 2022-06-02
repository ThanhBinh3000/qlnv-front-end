import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { NhapQuyetDinhGiaoDuToanChiNSNNComponent } from './nhap-quyet-dinh-giao-du-toan-chi-NSNN.component';
import { NhapQuyetDinhGiaoDuToanChiNSNNRoutingModule } from './nhap-quyet-dinh-giao-du-toan-chi-NSNN-routing.module';

@NgModule({
  declarations: [NhapQuyetDinhGiaoDuToanChiNSNNComponent],
  imports: [CommonModule,NhapQuyetDinhGiaoDuToanChiNSNNRoutingModule , ComponentsModule],
})
export class NhapQuyetDinhGiaoDuToanChiNSNNModule {}
