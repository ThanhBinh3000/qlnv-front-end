import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThopBcaoDcdtChiNsnnTrinhTongCucRoutingModule } from './thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc-routing.module';
import { ThopBcaoDcdtChiNsnnTrinhTongCucComponent } from './thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ThopBcaoDcdtChiNsnnTrinhTongCucComponent,
  ],
  imports: [
    CommonModule,
    ThopBcaoDcdtChiNsnnTrinhTongCucRoutingModule,
    ComponentsModule,
  ],
})

export class ThopBcaoDcdtChiNsnnTrinhTongCucModule {}
