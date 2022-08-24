import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachGhiNhanTienVonThuaRoutingModule } from './danh-sach-ghi-nhan-tien-von-thua-routing.module';
import { DanhSachGhiNhanTienVonThuaComponent } from './danh-sach-ghi-nhan-tien-von-thua.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DanhSachGhiNhanTienVonThuaComponent],
  imports: [CommonModule, DanhSachGhiNhanTienVonThuaRoutingModule, ComponentsModule],
})
export class DanhSachGhiNhanTienVonThuaModule {}
