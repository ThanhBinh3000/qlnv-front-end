import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapBaoCaoDieuChinhKiemTraRoutingModule } from './lap-bao-cao-dieu-chinh-kiem-tra-routing.module';
import { LapBaoCaoDieuChinhKiemTraComponent } from './lap-bao-cao-dieu-chinh-kiem-tra.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    LapBaoCaoDieuChinhKiemTraComponent,
  ],
  imports: [
    CommonModule,
    LapBaoCaoDieuChinhKiemTraRoutingModule,
    ComponentsModule,
  ],
})

export class LapBaoCaoDieuChinhKiemTraModule {}
