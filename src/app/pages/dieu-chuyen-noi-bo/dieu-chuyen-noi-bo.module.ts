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
import { TongHopDieuChuyenTaiTongCuc } from './tong-hop-dieu-chuyen-tai-tong-cuc/tong-hop-dieu-chuyen-tai-tong-cuc.component';
import { TongHopDieuChuyenCapTongCuc } from './tong-hop-dieu-chuyen-tai-tong-cuc/tong-hop-dieu-chuyen-cap-tong-cuc/tong-hop-dieu-chuyen-cap-tong-cuc.component';
import { ChiTietTongHopDieuChuyenCapTongCuc } from './tong-hop-dieu-chuyen-tai-tong-cuc/tong-hop-dieu-chuyen-cap-tong-cuc/chi-tiet-tong-hop-dieu-chuyen-cap-tong-cuc/chi-tiet-tong-hop-dieu-chuyen-cap-tong-cuc.component';
import { DialogTuChoiTongHopDieuChuyenComponent } from './tong-hop-dieu-chuyen-tai-cuc/components/dialog-tu-choi/dialog-tu-choi.component';
import { QuyetDinhDieuChuyenModule } from './quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen.module';

@NgModule({
  declarations: [
    DieuChuyenNoiBoComponent,
    KeHoachDieuChuyenComponent,
    ChiTietKeHoachDcnbComponent,
    TongHopDieuChuyenTaiCuc,
    ChiTietTongHopDieuChuyenTaiCuc,
    TongHopDieuChuyenTaiTongCuc,
    TongHopDieuChuyenCapTongCuc,
    ChiTietTongHopDieuChuyenCapTongCuc,
    DialogTuChoiTongHopDieuChuyenComponent
  ],
  imports: [
    CommonModule,
    DieuChuyenNoiBoRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    QuyetDinhDieuChuyenModule
  ],
  exports: [
    KeHoachDieuChuyenComponent,
    ChiTietKeHoachDcnbComponent,
    TongHopDieuChuyenTaiCuc,
    ChiTietTongHopDieuChuyenTaiCuc,
    TongHopDieuChuyenTaiTongCuc,
    TongHopDieuChuyenCapTongCuc,
    ChiTietTongHopDieuChuyenCapTongCuc
  ]
})
export class DieuChuyenNoiBoModule {
}
