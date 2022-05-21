import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaoCaoRoutingModule } from './bao-cao-routing.module';
import { BaoCaoComponent } from './bao-cao.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopDuToanChiThuongXuyenHangNamComponent } from '../tong-hop-du-toan-chi-thuong-xuyen-hang-nam/tong-hop-du-toan-chi-thuong-xuyen-hang-nam.component';
import { ChiTietNhuCauChiThuongXuyen3NamComponent } from '../chi-tiet-nhu-cau-chi-thuong-xuyen-3-nam/chi-tiet-nhu-cau-chi-thuong-xuyen-3-nam.component';
import { TongHopNhuCauChiNsnn3NamComponent } from '../tong-hop-nhu-cau-chi-nsnn-3-nam/tong-hop-nhu-cau-chi-nsnn-3-nam.component';
import { TongHopNhuCauChiThuongXuyen3NamComponent } from '../tong-hop-nhu-cau-chi-thuong-xuyen-3-nam/tong-hop-nhu-cau-chi-thuong-xuyen-3-nam.component';
import { TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent } from '../tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-3-nam/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-3-nam.component';


@NgModule({
  declarations: [
    BaoCaoComponent,
    TongHopDuToanChiThuongXuyenHangNamComponent,
    ChiTietNhuCauChiThuongXuyen3NamComponent,
    TongHopNhuCauChiNsnn3NamComponent,
    TongHopNhuCauChiThuongXuyen3NamComponent,
    TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent,
  ],
  imports: [
    CommonModule,
    BaoCaoRoutingModule,
    ComponentsModule,
  ],
})

export class BaoCaoModule {}
