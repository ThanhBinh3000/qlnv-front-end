import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachDeXuatDieuChinhDuToanChiNganSachRoutingModule } from './danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach-routing.module';
import { DanhSachDeXuatDieuChinhDuToanChiNganSachComponent } from './danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachDeXuatDieuChinhDuToanChiNganSachComponent,
  ],
  imports: [
    CommonModule,
    DanhSachDeXuatDieuChinhDuToanChiNganSachRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachDeXuatDieuChinhDuToanChiNganSachModule {}
