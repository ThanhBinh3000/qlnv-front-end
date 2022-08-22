import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanComponent } from './danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan.component';
import { DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanRoutingModule } from './danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan-routing.module';

@NgModule({
  declarations: [DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanComponent],
  imports: [CommonModule, DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanRoutingModule, ComponentsModule],
})
export class DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanModule {}
