import { NhapQuyetDinhGiaoDuToanChiNsnnDoTcdtBanHanhComponent } from './nhap-quyet-dinh-giao-du-toan-chi-nsnn-do-tcdt-ban-hanh.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapQuyetDinhGiaoDuToanChiNsnnDoTcdtBanHanhRoutingModule } from './nhap-quyet-dinh-giao-du-toan-chi-nsnn-do-tcdt-ban-hanh-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhapQuyetDinhGiaoDuToanChiNsnnDoTcdtBanHanhComponent,
  ],
  imports: [
    CommonModule,
    NhapQuyetDinhGiaoDuToanChiNsnnDoTcdtBanHanhRoutingModule,
    ComponentsModule,
  ],
})

export class NhapQuyetDinhGiaoDuToanChiNsnnDoTcdtBanHanhModule {}
