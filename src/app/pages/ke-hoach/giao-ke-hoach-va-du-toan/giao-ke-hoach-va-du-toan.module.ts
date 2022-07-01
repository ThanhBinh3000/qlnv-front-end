import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { GiaoKeHoachVaDuToanRoutingModule } from './giao-ke-hoach-va-du-toan-routing.module';
import { GiaoKeHoachVaDuToanComponent } from './giao-ke-hoach-va-du-toan.component';
import { KeHoachVonDauNamModule } from './ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module';
import { KeHoachVonMuaBuModule } from './ke-hoach-von-mua-bu/ke-hoach-von-mua-bu.module';
import { KeHoachXuatModule } from './ke-hoach-xuat/ke-hoach-xuat.module';

@NgModule({
  declarations: [
    GiaoKeHoachVaDuToanComponent,
  ],
  imports: [
    CommonModule,
    GiaoKeHoachVaDuToanRoutingModule,
    ComponentsModule,
    KeHoachVonDauNamModule,
    KeHoachVonMuaBuModule,
    KeHoachXuatModule,
  ],
})
export class GiaoKeHoachVaDuToanModule { }
