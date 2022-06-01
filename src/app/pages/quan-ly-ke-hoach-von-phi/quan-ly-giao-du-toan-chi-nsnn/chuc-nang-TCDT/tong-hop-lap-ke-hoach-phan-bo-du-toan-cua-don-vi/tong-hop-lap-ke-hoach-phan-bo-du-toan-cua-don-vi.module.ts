import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopLapKeHoachPhanBoDuToanCuaDonViRoutingModule } from './tong-hop-lap-ke-hoach-phan-bo-du-toan-cua-don-vi-routing.module';
import { TongHopLapKeHoachPhanBoDuToanCuaDonViComponent } from './tong-hop-lap-ke-hoach-phan-bo-du-toan-cua-don-vi.component';


@NgModule({
  declarations: [TongHopLapKeHoachPhanBoDuToanCuaDonViComponent],
  imports: [CommonModule, TongHopLapKeHoachPhanBoDuToanCuaDonViRoutingModule, ComponentsModule],
})
export class TongHopLapKeHoachPhanBoDuToanCuaDonViModule {}
