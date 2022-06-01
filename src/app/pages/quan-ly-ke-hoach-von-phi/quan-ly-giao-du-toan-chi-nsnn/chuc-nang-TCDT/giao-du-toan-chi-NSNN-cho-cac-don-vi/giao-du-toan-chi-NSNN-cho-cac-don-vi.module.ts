import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { GiaoDuToanChiNSNNChoCacDonViRoutingModule } from './giao-du-toan-chi-NSNN-cho-cac-don-vi-routing.module';
import { GiaoDuToanChiNSNNChoCacDonViComponent } from './giao-du-toan-chi-NSNN-cho-cac-don-vi.component';

@NgModule({
  declarations: [GiaoDuToanChiNSNNChoCacDonViComponent],
  imports: [CommonModule, GiaoDuToanChiNSNNChoCacDonViRoutingModule, ComponentsModule],
})
export class GiaoDuToanChiNSNNChoCacDonViModule {}
