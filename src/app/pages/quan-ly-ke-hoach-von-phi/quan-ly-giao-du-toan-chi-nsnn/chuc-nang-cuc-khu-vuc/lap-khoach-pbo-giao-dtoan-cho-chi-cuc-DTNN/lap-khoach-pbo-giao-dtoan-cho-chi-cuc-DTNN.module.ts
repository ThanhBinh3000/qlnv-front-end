import { LapKhoachPboGiaoDtoanChoChiCucDTNNComponent } from './lap-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LapKhoachPboGiaoDtoanChoChiCucDTNNRoutingModule } from './lap-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    LapKhoachPboGiaoDtoanChoChiCucDTNNComponent,
  ],
  imports: [
    CommonModule,
    LapKhoachPboGiaoDtoanChoChiCucDTNNRoutingModule,
    ComponentsModule,
  ],
})

export class LapKhoachPboGiaoDtoanChoChiCucDTNNModule {}
