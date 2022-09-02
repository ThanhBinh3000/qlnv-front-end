import { ComponentsModule } from './../../../components/components.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MangPvcCongCuDungCuComponent } from './mang-pvc-cong-cu-dung-cu.component';

@NgModule({
  declarations: [MangPvcCongCuDungCuComponent],
  imports: [
    CommonModule,
    ComponentsModule
  ],
})
export class MangPvcCongCuDungCuModule { }
