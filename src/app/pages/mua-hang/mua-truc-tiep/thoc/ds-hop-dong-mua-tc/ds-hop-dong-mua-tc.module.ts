import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsHopDongMuaTCComponent } from './ds-hop-dong-mua-tc.component';
import { DsHopDongMuaTCRoutingModule } from './ds-hop-dong-mua-tc-routing.module';

@NgModule({
  declarations: [DsHopDongMuaTCComponent],
  imports: [CommonModule, DsHopDongMuaTCRoutingModule, ComponentsModule],
})
export class DsHopDongMuaTCModule {}
