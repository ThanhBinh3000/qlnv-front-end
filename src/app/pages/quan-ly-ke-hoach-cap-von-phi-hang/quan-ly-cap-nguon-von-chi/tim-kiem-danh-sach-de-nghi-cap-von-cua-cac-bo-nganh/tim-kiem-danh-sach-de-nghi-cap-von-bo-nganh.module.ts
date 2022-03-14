import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { TimKiemDanhSachDeNghiCapVonBoNganhComponent } from './tim-kiem-danh-sach-de-nghi-cap-von-bo-nganh.component';
import { TimKiemDanhSachDeNghiCapVonBoNganhRoutingModule } from './tim-kiem-danh-sach-de-nghi-cap-von-bo-nganh-routing.module';

@NgModule({
  declarations: [TimKiemDanhSachDeNghiCapVonBoNganhComponent],
  imports: [CommonModule, TimKiemDanhSachDeNghiCapVonBoNganhRoutingModule, ComponentsModule],
})
export class TimKiemDanhSachDeNghiCapVonBoNganhModule {}
