import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { ChonKhoanMucComponent } from './chon-khoan-muc.component';
import { ChonKhoanMucComponentRoutingModule } from './chon-khoan-muc-routing.module';




@NgModule({
  declarations: [
    ChonKhoanMucComponent,
  ],
  imports: [
    CommonModule,
    ChonKhoanMucComponentRoutingModule,
    ComponentsModule,
  ],
})

export class ChonKhoanMucModule {}
