import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsachThopBcaoDcdtChiNsnnTrinhTongCucRoutingModule } from './dsach-thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc-routing.module';
import { DsachThopBcaoDcdtChiNsnnTrinhTongCucComponent } from './dsach-thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DsachThopBcaoDcdtChiNsnnTrinhTongCucComponent,
  ],
  imports: [
    CommonModule,
    DsachThopBcaoDcdtChiNsnnTrinhTongCucRoutingModule,
    ComponentsModule,
  ],
})

export class DsachThopBcaoDcdtChiNsnnTrinhTongCucModule {}
