import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViRoutingModule } from './xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi-routing.module';
import { XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViComponent } from './xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.component';



@NgModule({
  declarations: [XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViComponent],
  imports: [CommonModule, XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViRoutingModule, ComponentsModule],
})
export class XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViModule {}
