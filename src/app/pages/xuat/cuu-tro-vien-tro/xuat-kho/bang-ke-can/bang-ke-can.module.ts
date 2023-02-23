import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChiTietBangKeCanComponent } from './chi-tiet-bang-ke-can/chi-tiet-bang-ke-can.component';



@NgModule({
  declarations: [
    ChiTietBangKeCanComponent
  ],
  exports: [
    ChiTietBangKeCanComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BangKeCanModule { }
