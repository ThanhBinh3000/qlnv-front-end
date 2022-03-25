import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuanLyCapNguonVonChiNSNNComponent } from './quan-ly-cap-nguon-von-chi.component';
import { QuanLyCapNguonVonChiNSNNRoutingModule } from './quan-ly-cap-nguon-von-chi-routing.module';
import { LapDeNghiCapVonMuaVatTuThietBiComponent } from './lap-de-nghi-cap-von-mua-vat-tu-thiet-bi/lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.component';
import { LapDeNghiCapVonMuaLuongThucMuoiComponent } from './lap-de-nghi-cap-von-mua-luong-thuc-muoi/lap-de-nghi-cap-von-mua-luong-thuc-muoi.component';
import { TongHopDeNghiCapVonComponent } from './tong-hop-de-nghi-cap-von/tong-hop-de-nghi-cap-von.component';
import { TheoDoiCapVonMuaHangDtqgComponent } from './theo-doi-cap-von-mua-hang-DTQG/theo-doi-cap-von-mua-hang-dtqg.component';
import { TheoDoiCapVonMuaHangDtqg2Component } from './theo-doi-cap-von-mua-hang-DTQG-2/theo-doi-cap-von-mua-hang-dtqg-2.component';

@NgModule({
  declarations: [
    QuanLyCapNguonVonChiNSNNComponent,
    LapDeNghiCapVonMuaVatTuThietBiComponent,
    LapDeNghiCapVonMuaLuongThucMuoiComponent,
    TongHopDeNghiCapVonComponent,
    TheoDoiCapVonMuaHangDtqgComponent,
    TheoDoiCapVonMuaHangDtqg2Component,
  ],
  imports: [CommonModule, QuanLyCapNguonVonChiNSNNRoutingModule, ComponentsModule],
})
export class QuanLyCapNguonVonChiNSNNModule {}
