import { DieuChinhChiTieuKeHoachNamComponent } from './../dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ChiTieuKeHoachNamComponent } from './../chi-tieu-ke-hoach-nam-cap-tong-cuc/chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { GiaoKeHoachVaDuToanComponent } from './giao-ke-hoach-va-du-toan.component';
import { GiaoKeHoachVaDuToanRoutingModule } from './giao-ke-hoach-va-du-toan-routing.module';
import { ChiTieuKeHoachNamModule } from '../chi-tieu-ke-hoach-nam-cap-tong-cuc/chi-tieu-ke-hoach-nam-cap-tong-cuc.module';

@NgModule({
  declarations: [GiaoKeHoachVaDuToanComponent, ChiTieuKeHoachNamComponent, DieuChinhChiTieuKeHoachNamComponent],
  imports: [CommonModule, GiaoKeHoachVaDuToanRoutingModule, ComponentsModule],
})
export class GiaoKeHoachVaDuToanModule { }
