import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TongHopTuCucKhuVucRoutingModule } from './tong-hop-tu-cuc-khu-vuc-routing.module';
import { TongHopTuCucKhuVucComponent } from './tong-hop-tu-cuc-khu-vuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TongHopTuCucKhuVucComponent],
  imports: [CommonModule, TongHopTuCucKhuVucRoutingModule, ComponentsModule],
})
export class TongHopTuCucKhuVucModule {}
