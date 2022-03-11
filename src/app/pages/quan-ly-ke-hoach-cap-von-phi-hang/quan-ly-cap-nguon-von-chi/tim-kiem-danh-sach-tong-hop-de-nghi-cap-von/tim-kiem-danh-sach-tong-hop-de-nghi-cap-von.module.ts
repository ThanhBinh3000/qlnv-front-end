import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { TimKiemDanhSachTongHopDeNghiCapVonRoutingModule } from './tim-kiem-danh-sach-tong-hop-de-nghi-cap-von-routing.module';
import { TimKiemDanhSachTongHopDeNghiCapVonComponent } from './tim-kiem-danh-sach-tong-hop-de-nghi-cap-von.component';

@NgModule({
  declarations: [TimKiemDanhSachTongHopDeNghiCapVonComponent],
  imports: [CommonModule, TimKiemDanhSachTongHopDeNghiCapVonRoutingModule, ComponentsModule],
})
export class TimKiemDanhSachTongHopDeNghiCapVonModule {}
