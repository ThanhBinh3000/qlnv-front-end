import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DieuChuyenNoiBoRoutingModule } from './dieu-chuyen-noi-bo-routing.module';
import { DieuChuyenNoiBoComponent } from './dieu-chuyen-noi-bo.component';
import { ComponentsModule } from "../../components/components.module";
import { MainModule } from "../../layout/main/main.module";
import { DirectivesModule } from "../../directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { KeHoachDieuChuyenComponent } from "./ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.component";
import {
  ChiTietKeHoachDcnbComponent
} from "./ke-hoach-dieu-chuyen/chi-tiet-ke-hoach-dcnb/chi-tiet-ke-hoach-dcnb.component";
import { TongHopDieuChuyenTaiCuc } from './tong-hop-dieu-chuyen-tai-cuc/tong-hop-dieu-chuyen-tai-cuc.component';
import { ChiTietTongHopDieuChuyenTaiCuc } from './tong-hop-dieu-chuyen-tai-cuc/chi-tiet-tong-hop-tai-cuc/chi-tiet-tong-hop-tai-cuc.component';


@NgModule({
  declarations: [
    DieuChuyenNoiBoComponent,
    KeHoachDieuChuyenComponent,
    ChiTietKeHoachDcnbComponent,
    TongHopDieuChuyenTaiCuc,
    ChiTietTongHopDieuChuyenTaiCuc

  ],
  imports: [
    CommonModule,
    DieuChuyenNoiBoRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ],
  exports: [
    KeHoachDieuChuyenComponent,
    ChiTietKeHoachDcnbComponent,
    TongHopDieuChuyenTaiCuc,
    ChiTietTongHopDieuChuyenTaiCuc
  ]
})
export class DieuChuyenNoiBoModule {
}
