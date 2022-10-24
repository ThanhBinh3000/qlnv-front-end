import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachNopTienThuaRoutingModule } from './danh-sach-nop-tien-thua-routing.module';
import { DanhSachNopTienThuaComponent } from './danh-sach-nop-tien-thua.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DanhSachNopTienThuaComponent],
  imports: [CommonModule, DanhSachNopTienThuaRoutingModule, ComponentsModule],
})
export class DanhSachNopTienThuaModule {}
