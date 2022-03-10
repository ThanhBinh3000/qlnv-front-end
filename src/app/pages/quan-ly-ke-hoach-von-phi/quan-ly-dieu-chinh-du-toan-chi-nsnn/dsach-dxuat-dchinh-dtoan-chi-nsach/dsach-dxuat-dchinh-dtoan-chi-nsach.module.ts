import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsachDxuatDchinhDtoanChiNsachRoutingModule } from './dsach-dxuat-dchinh-dtoan-chi-nsach-routing.module';
import { DsachDxuatDchinhDtoanChiNsachComponent } from './dsach-dxuat-dchinh-dtoan-chi-nsach.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DsachDxuatDchinhDtoanChiNsachComponent,
  ],
  imports: [
    CommonModule,
    DsachDxuatDchinhDtoanChiNsachRoutingModule,
    ComponentsModule,
  ],
})

export class DsachDxuatDchinhDtoanChiNsachModule {}
