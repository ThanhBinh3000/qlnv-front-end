import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TimKiemNhanDuToanChiNSNNCuaCacDonViRoutingModule } from './tim-kiem-nhan-du-toan-chi-NSNN-cua-cac-don-vi-routing.module';
import { TimKiemNhanDuToanChiNSNNCuaCacDonViComponent } from './tim-kiem-nhan-du-toan-chi-NSNN-cua-cac-don-vi.component';

@NgModule({
  declarations: [TimKiemNhanDuToanChiNSNNCuaCacDonViComponent],
  imports: [CommonModule, TimKiemNhanDuToanChiNSNNCuaCacDonViRoutingModule, ComponentsModule],
})
export class TimKiemNhanDuToanChiNSNNCuaCacDonViModule {}
