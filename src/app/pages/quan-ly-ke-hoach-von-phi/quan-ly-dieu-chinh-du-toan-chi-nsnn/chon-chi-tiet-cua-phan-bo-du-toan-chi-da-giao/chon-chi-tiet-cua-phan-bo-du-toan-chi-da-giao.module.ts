import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChonChiTietCuaPhanBoDuToanChiDaGiaoRoutingModule } from './chon-chi-tiet-cua-phan-bo-du-toan-chi-da-giao-routing.module';
import { ChonChiTietCuaPhanBoDuToanChiDaGiaoComponent } from './chon-chi-tiet-cua-phan-bo-du-toan-chi-da-giao.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ChonChiTietCuaPhanBoDuToanChiDaGiaoComponent,
  ],
  imports: [
    CommonModule,
    ChonChiTietCuaPhanBoDuToanChiDaGiaoRoutingModule,
    ComponentsModule,
  ],
})

export class ChonChiTietCuaPhanBoDuToanChiDaGiaoModule {}
