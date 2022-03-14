import { DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucComponent } from './ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucRoutingModule } from './ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucComponent,
  ],
  imports: [
    CommonModule,
    DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucRoutingModule,
    ComponentsModule,
  ],
})

export class DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucModule {}
