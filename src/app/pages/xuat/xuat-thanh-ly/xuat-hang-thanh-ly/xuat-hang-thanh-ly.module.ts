import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XuatHangThanhLyRoutingModule } from './xuat-hang-thanh-ly-routing.module';
import { XuatHangThanhLyComponent } from './xuat-hang-thanh-ly.component';
import { ComponentsModule } from 'src/app/components/components.module';



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
