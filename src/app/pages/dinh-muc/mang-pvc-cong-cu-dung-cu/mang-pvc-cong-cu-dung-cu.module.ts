import { ComponentsModule } from './../../../components/components.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MangPvcCongCuDungCuComponent } from './mang-pvc-cong-cu-dung-cu.component';
import { MangPvcCongCuDungCuRoutingModule } from './mang-pvc-cong-cu-dung-cu-routing.module';
import { HopDongMuaSamComponent } from './hop-dong-mua-sam/hop-dong-mua-sam.component';
import { ThongTinHopDongMuaSamComponent } from './hop-dong-mua-sam/thong-tin-hop-dong-mua-sam/thong-tin-hop-dong-mua-sam.component';
import { PhuLucHopDongMuaSamComponent } from './hop-dong-mua-sam/phu-luc-hop-dong-mua-sam/phu-luc-hop-dong-mua-sam.component';

@NgModule({
  declarations: [
    MangPvcCongCuDungCuComponent,
    HopDongMuaSamComponent,
    ThongTinHopDongMuaSamComponent,
    PhuLucHopDongMuaSamComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MangPvcCongCuDungCuRoutingModule,
  ],
  exports: [
    MangPvcCongCuDungCuComponent,
    HopDongMuaSamComponent,
  ]
})
export class MangPvcCongCuDungCuModule { }
