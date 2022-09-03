import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MayMocThietBiModule } from '../may-moc-thiet-bi/may-moc-thiet-bi.module';
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
    MayMocThietBiModule,
  ],
  exports: [
    MangPvcCongCuDungCuComponent,
  ]
})
export class MangPvcCongCuDungCuModule { }
