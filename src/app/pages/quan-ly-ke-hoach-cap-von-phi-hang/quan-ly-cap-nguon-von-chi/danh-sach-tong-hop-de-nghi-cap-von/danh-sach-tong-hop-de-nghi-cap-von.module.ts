import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DanhSachTongHopDeNghiCapVonComponent } from './danh-sach-tong-hop-de-nghi-cap-von.component';
import { DanhSachTongHopDeNghiCapVonRoutingModule } from './danh-sach-tong-hop-de-nghi-cap-von-routing.module';

@NgModule({
  declarations: [DanhSachTongHopDeNghiCapVonComponent],
  imports: [CommonModule, DanhSachTongHopDeNghiCapVonRoutingModule, ComponentsModule],
})
export class DanhSachTongHopDeNghiCapVonModule {}
