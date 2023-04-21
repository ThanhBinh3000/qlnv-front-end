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

@NgModule({
  declarations: [
    DieuChuyenNoiBoComponent,
    KeHoachDieuChuyenComponent,
    ChiTietKeHoachDcnbComponent
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
    ChiTietKeHoachDcnbComponent
  ]
})
export class DieuChuyenNoiBoModule {
}
