import { TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent } from './tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcRoutingModule } from './tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent,
  ],
  imports: [
    CommonModule,
    TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcRoutingModule,
    ComponentsModule,
  ],
})

export class TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcModule {}
