import { KeHoachDuToanCaiTaoSuaChuaHtKt3NamComponent } from './ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeHoachDuToanCaiTaoSuaChuaHtKt3NamRoutingModule } from './ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    KeHoachDuToanCaiTaoSuaChuaHtKt3NamComponent,
  ],
  imports: [
    CommonModule,
    KeHoachDuToanCaiTaoSuaChuaHtKt3NamRoutingModule,
    ComponentsModule,
  ],
})

export class KeHoachDuToanCaiTaoSuaChuaHtKt3NamModule {}
