import { ComponentsModule } from './../../../components/components.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MangPvcCongCuDungCuComponent } from './mang-pvc-cong-cu-dung-cu.component';
import { MangPvcCongCuDungCuRoutingModule } from './mang-pvc-cong-cu-dung-cu-routing.module';

@NgModule({
  declarations: [MangPvcCongCuDungCuComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    MangPvcCongCuDungCuRoutingModule,
  ],
})
export class MangPvcCongCuDungCuModule { }
