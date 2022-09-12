import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { TongHopTaiTongCucRoutingModule } from './tong-hop-tai-tong-cuc-routing.module';
import { TongHopTaiTongCucComponent } from './tong-hop-tai-tong-cuc.component';

@NgModule({
  declarations: [
    TongHopTaiTongCucComponent,
  ],
  imports: [
    CommonModule,
    TongHopTaiTongCucRoutingModule,
    ComponentsModule,
  ],

})
export class TongHopTaiTongCucModule { }
