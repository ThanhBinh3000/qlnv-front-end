import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XuatHangThanhLyRoutingModule } from './xuat-hang-thanh-ly-routing.module';
import { XuatHangThanhLyComponent } from './xuat-hang-thanh-ly.component';
import { ComponentsModule } from 'src/app/components/components.module';
import {KiemTraModule} from "./kiem-tra/kiem-tra.module";
import {XuatKhoModule} from "./xuat-kho/xuat-kho.module";



@NgModule({
  declarations: [
    XuatHangThanhLyComponent,
  ],
  imports: [
    CommonModule,
    XuatHangThanhLyRoutingModule,
    ComponentsModule,
  ],
  exports: [
    XuatHangThanhLyComponent,
  ]
})
export class XuatHangThanhLyModule { }
