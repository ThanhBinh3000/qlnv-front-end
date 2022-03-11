import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuanLyCapNguonVonChiNSNNComponent } from './quan-ly-cap-nguon-von-chi.component';
import { QuanLyCapNguonVonChiNSNNRoutingModule } from './quan-ly-cap-nguon-von-chi-routing.module';
import { LapDeNghiCapVonMuaVatTuThietBiComponent } from './lap-de-nghi-cap-von-mua-vat-tu-thiet-bi/lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.component';
import { LapDeNghiCapVonMuaLuongThucMuoiComponent } from './lap-de-nghi-cap-von-mua-luong-thuc-muoi/lap-de-nghi-cap-von-mua-luong-thuc-muoi.component';

@NgModule({
  declarations: [
    QuanLyCapNguonVonChiNSNNComponent,
    LapDeNghiCapVonMuaVatTuThietBiComponent,
    LapDeNghiCapVonMuaLuongThucMuoiComponent,
  ],
  imports: [CommonModule, QuanLyCapNguonVonChiNSNNRoutingModule, ComponentsModule],
})
export class QuanLyCapNguonVonChiNSNNModule {}
