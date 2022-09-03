import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from './../../../components/components.module';
import { HopDongMuaSamModule } from './hop-dong-mua-sam/hop-dong-mua-sam.module';
import { MangPvcCongCuDungCuRoutingModule } from './mang-pvc-cong-cu-dung-cu-routing.module';
import { MangPvcCongCuDungCuComponent } from './mang-pvc-cong-cu-dung-cu.component';

@NgModule({
  declarations: [
    MangPvcCongCuDungCuComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MangPvcCongCuDungCuRoutingModule,
    HopDongMuaSamModule,
  ],
  exports: [
    MangPvcCongCuDungCuComponent,
  ]
})
export class MangPvcCongCuDungCuModule { }
