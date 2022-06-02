import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { GiaoKeHoachVaDuToanComponent } from './giao-ke-hoach-va-du-toan.component';
import { GiaoKeHoachVaDuToanRoutingModule } from './giao-ke-hoach-va-du-toan-routing.module';
import { ChiTieuKeHoachNamComponent } from './chi-tieu-ke-hoach-nam-cap-tong-cuc/chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { DieuChinhChiTieuKeHoachNamComponent } from './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { DeXuatDieuChinhComponent } from './de-xuat-dieu-chinh/de-xuat-dieu-chinh.component';
import { DieuChinhThongTinChiTieuKeHoachNamComponent } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ThongTinChiTieuKeHoachNamComponent } from './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ThongTinDeXuatDieuChinhComponent } from './thong-tin-de-xuat-dieu-chinh/thong-tin-de-xuat-dieu-chinh.component';

@NgModule({
  declarations: [
    GiaoKeHoachVaDuToanComponent,
    ChiTieuKeHoachNamComponent,
    DieuChinhChiTieuKeHoachNamComponent,
    DeXuatDieuChinhComponent,
    DieuChinhThongTinChiTieuKeHoachNamComponent,
    ThongTinChiTieuKeHoachNamComponent,
    ThongTinDeXuatDieuChinhComponent,
  ],
  imports: [
    CommonModule,
    GiaoKeHoachVaDuToanRoutingModule,
    ComponentsModule
  ],
})
export class GiaoKeHoachVaDuToanModule { }
