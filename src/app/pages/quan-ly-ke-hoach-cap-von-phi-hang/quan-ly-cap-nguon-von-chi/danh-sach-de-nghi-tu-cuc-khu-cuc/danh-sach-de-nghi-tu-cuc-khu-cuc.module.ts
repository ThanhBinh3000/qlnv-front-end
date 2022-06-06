import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachDeNghiTuCucKhuVucRoutingModule } from './danh-sach-de-nghi-tu-cuc-khu-cuc-routing.module';
import { DanhSachDeNghiTuCucKhuVucComponent } from './danh-sach-de-nghi-tu-cuc-khu-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DanhSachDeNghiTuCucKhuVucComponent],
  imports: [CommonModule, DanhSachDeNghiTuCucKhuVucRoutingModule, ComponentsModule],
})
export class DanhSachDeNghiTuCucKhuVucModule {}
