import { DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent } from './dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcRoutingModule } from './dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent,
  ],
  imports: [
    CommonModule,
    DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcRoutingModule,
    ComponentsModule,
  ],
})

export class DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcModule {}
