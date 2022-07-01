import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsHopDongMuaTCComponent } from './ds-hop-dong-mua-tc.component';

const routes: Routes = [
  {
    path: '',
    component: DsHopDongMuaTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsHopDongMuaTCRoutingModule {}
