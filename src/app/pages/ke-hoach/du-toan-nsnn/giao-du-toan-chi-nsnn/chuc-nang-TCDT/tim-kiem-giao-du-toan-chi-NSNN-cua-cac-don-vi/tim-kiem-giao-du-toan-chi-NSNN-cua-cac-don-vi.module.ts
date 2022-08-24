import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TimKiemGiaoDuToanChiNSNNCuaCacDonViRoutingModule } from './tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi-routing.module';
import { TimKiemGiaoDuToanChiNSNNCuaCacDonViComponent } from './tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi.component';

@NgModule({
  declarations: [TimKiemGiaoDuToanChiNSNNCuaCacDonViComponent],
  imports: [CommonModule, TimKiemGiaoDuToanChiNSNNCuaCacDonViRoutingModule, ComponentsModule],
})
export class TimKiemGiaoDuToanChiNSNNCuaCacDonViModule {}
