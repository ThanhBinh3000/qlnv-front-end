import { LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucComponent } from './lap-khoach-pb-giao-dtoan-cho-chi-cucDTNN-vpCuc.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucRoutingModule } from './lap-khoach-pb-giao-dtoan-cho-chi-cucDTNN-vpCuc-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucComponent,
  ],
  imports: [
    CommonModule,
    LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucRoutingModule,
    ComponentsModule,
  ],
})

export class LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucModule {}
