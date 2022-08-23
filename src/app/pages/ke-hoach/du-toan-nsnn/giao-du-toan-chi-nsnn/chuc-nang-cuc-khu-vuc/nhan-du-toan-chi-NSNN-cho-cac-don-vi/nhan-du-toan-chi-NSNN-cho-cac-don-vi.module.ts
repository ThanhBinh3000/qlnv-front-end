import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { NhanDuToanChiNSNNChoCacDonViRoutingModule } from './nhan-du-toan-chi-NSNN-cho-cac-don-vi-routing.module';
import { NhanDuToanChiNSNNChoCacDonViComponent } from './nhan-du-toan-chi-NSNN-cho-cac-don-vi.component';

@NgModule({
  declarations: [NhanDuToanChiNSNNChoCacDonViComponent],
  imports: [CommonModule, NhanDuToanChiNSNNChoCacDonViRoutingModule, ComponentsModule],
})
export class NhanDuToanChiNSNNChoCacDonViModule {}
