import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { GiaoNhiemVuComponent } from './giao-nhiem-vu.component';
import { GiaoNhiemVuRoutingModule } from './giao-nhiem-vu-routing.module';
import { PhuLuc1Component } from './phu-luc1/phu-luc1.component';

@NgModule({
  declarations: [
    GiaoNhiemVuComponent,
    // PhuLuc1Component
  ],
  imports: [
    CommonModule,
    GiaoNhiemVuRoutingModule,
    ComponentsModule,
  ],
})

export class GiaoNhiemVuModule {}
