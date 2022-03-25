import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { TimKiemDanhSachDeNghiCapVonRoutingModule } from './tim-kiem-danh-sach-de-nghi-cap-von-routing.module';
import { TimKiemDanhSachDeNghiCapVonComponent } from './tim-kiem-danh-sach-de-nghi-cap-von.component';

@NgModule({
  declarations: [TimKiemDanhSachDeNghiCapVonComponent],
  imports: [CommonModule, TimKiemDanhSachDeNghiCapVonRoutingModule, ComponentsModule],
})
export class TimKiemDanhSachDeNghiCapVonModule {}
