import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TimKiemQuyetDinhNhapDuToanChiNSNNRoutingModule } from './tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN-router.module';
import { TimKiemQuyetDinhNhapDuToanChiNSNNComponent } from './tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN.component';

@NgModule({
  declarations: [TimKiemQuyetDinhNhapDuToanChiNSNNComponent],
  imports: [CommonModule, TimKiemQuyetDinhNhapDuToanChiNSNNRoutingModule, ComponentsModule],
})
export class TimKiemQuyetDinhNhapDuToanChiNSNNModule {}
