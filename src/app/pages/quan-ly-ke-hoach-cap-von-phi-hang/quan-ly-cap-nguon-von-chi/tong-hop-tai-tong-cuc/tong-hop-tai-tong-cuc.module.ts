import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TongHopTaiTongCucRoutingModule } from './tong-hop-tai-tong-cuc-routing.module';
import { TongHopTaiTongCucComponent } from './tong-hop-tai-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TongHopTaiTongCucComponent],
  imports: [CommonModule, TongHopTaiTongCucRoutingModule, ComponentsModule],
})
export class TongHopTaiTongCucModule {}
