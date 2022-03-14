import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapQuyetDinhGiaoDuToanChiNsnnBtcPdRoutingModule } from './nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd-routing.module';
import { NhapQuyetDinhGiaoDuToanChiNsnnBtcPdComponent } from './nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhapQuyetDinhGiaoDuToanChiNsnnBtcPdComponent,
  ],
  imports: [
    CommonModule,
    NhapQuyetDinhGiaoDuToanChiNsnnBtcPdRoutingModule,
    ComponentsModule,
  ],
})

export class NhapQuyetDinhGiaoDuToanChiNsnnBtcPdModule {}
