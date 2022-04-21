import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { ThongTinHopDongMuaTCComponent } from './thong-tin-hop-dong-mua-tc.component';
import { ThongTinHopDongMuaTCRoutingModule } from './thong-tin-hop-dong-mua-tc-routing.module';

@NgModule({
  declarations: [ThongTinHopDongMuaTCComponent],
  imports: [CommonModule, ThongTinHopDongMuaTCRoutingModule, ComponentsModule],
})
export class ThongTinHopDongMuaTCModule {}
