import { ComponentsModule } from './../../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DinhMucTrangBiCongCuComponent } from './dinh-muc-trang-bi-cong-cu.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [DinhMucTrangBiCongCuComponent]
})
export class DinhMucTrangBiCongCuModule { }
