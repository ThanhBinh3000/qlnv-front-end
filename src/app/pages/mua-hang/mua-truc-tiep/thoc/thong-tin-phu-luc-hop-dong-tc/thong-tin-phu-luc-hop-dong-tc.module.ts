import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { ThongTinPhuLucHopDongTCComponent } from './thong-tin-phu-luc-hop-dong-tc.component';
import { ThongTinPhuLucHopDongTCRoutingModule } from './thong-tin-phu-luc-hop-dong-tc-routing.module';

@NgModule({
  declarations: [ThongTinPhuLucHopDongTCComponent],
  imports: [
    CommonModule,
    ThongTinPhuLucHopDongTCRoutingModule,
    ComponentsModule,
  ],
})
export class ThongTinPhuLucHopDongTCModule {}
