import { KeHoachQuyTienLuongNamN1Component } from './ke-hoach-quy-tien-luong-nam-n1.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeHoachQuyTienLuongNamN1RoutingModule } from './ke-hoach-quy-tien-luong-nam-n1-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    KeHoachQuyTienLuongNamN1Component,
  ],
  imports: [
    CommonModule,
    KeHoachQuyTienLuongNamN1RoutingModule,
    ComponentsModule,
  ],
})

export class KeHoachQuyTienLuongNamN1Module {}
