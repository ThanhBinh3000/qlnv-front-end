import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TongHopDuToanChiThuongXuyenHangNamRoutingModule } from './tong-hop-du-toan-chi-thuong-xuyen-hang-nam-routing.module';
import { TongHopDuToanChiThuongXuyenHangNamComponent } from './tong-hop-du-toan-chi-thuong-xuyen-hang-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    TongHopDuToanChiThuongXuyenHangNamComponent,
  ],
  imports: [
    CommonModule,
    TongHopDuToanChiThuongXuyenHangNamRoutingModule,
    ComponentsModule,
  ],
})

export class TongHopDuToanChiThuongXuyenHangNamModule {}
