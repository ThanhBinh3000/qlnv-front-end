import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapHangRoutingModule } from './to-chuc-thanh-ly-routing.module';
import { NhapHangComponent } from './to-chuc-thanh-ly.component';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [
    NhapHangComponent,

  ],
  imports: [
    CommonModule,
    NhapHangRoutingModule,
    ComponentsModule
  ],
  exports: [
    NhapHangComponent,
  ]
})
export class ToChucThanhLyModule { }
