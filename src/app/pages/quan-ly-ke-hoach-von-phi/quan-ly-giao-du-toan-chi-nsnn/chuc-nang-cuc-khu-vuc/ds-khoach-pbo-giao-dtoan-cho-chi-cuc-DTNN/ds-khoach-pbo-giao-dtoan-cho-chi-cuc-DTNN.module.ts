import { DsKhoachPboGiaoDtoanChoChiCucDTNNComponent } from './ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsKhoachPboGiaoDtoanChoChiCucDTNNRoutingModule } from './ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DsKhoachPboGiaoDtoanChoChiCucDTNNComponent,
  ],
  imports: [
    CommonModule,
    DsKhoachPboGiaoDtoanChoChiCucDTNNRoutingModule,
    ComponentsModule,
  ],
})

export class DsKhoachPboGiaoDtoanChoChiCucDTNNModule {}
