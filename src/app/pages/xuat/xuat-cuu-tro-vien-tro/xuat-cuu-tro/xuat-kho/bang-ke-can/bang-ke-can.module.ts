import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChiTietBangKeCanComponent } from './chi-tiet-bang-ke-can/chi-tiet-bang-ke-can.component';
import {ComponentsModule} from "src/app/components/components.module";
import {DirectivesModule} from "src/app/directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";



@NgModule({
 /* declarations: [
    ChiTietBangKeCanComponent
  ],
  exports: [
    ChiTietBangKeCanComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule
  ]*/
})
export class BangKeCanModule { }
