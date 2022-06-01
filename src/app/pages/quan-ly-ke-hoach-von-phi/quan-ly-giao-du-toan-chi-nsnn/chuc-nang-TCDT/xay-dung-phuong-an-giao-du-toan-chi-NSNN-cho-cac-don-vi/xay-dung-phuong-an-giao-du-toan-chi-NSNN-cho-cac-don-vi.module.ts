import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViRoutingModule } from './xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi-routing.module';
import { XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViComponent } from './xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi.component';



@NgModule({
  declarations: [XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViComponent],
  imports: [CommonModule, XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViRoutingModule, ComponentsModule],
})
export class XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViModule {}
