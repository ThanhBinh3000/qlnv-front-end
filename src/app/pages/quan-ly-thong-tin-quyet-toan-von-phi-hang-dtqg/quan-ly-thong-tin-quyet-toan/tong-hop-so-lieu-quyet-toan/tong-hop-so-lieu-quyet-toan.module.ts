import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopSoLieuQuyetToanRoutingModule } from './tong-hop-so-lieu-quyet-toan-routing.module';
import { TongHopSoLieuQuyetToanComponent } from './tong-hop-so-lieu-quyet-toan.component';


@NgModule({
  declarations: [TongHopSoLieuQuyetToanComponent],
  imports: [CommonModule, TongHopSoLieuQuyetToanRoutingModule, ComponentsModule],
})
export class TongHopSoLieuQuyetToanModule {}
