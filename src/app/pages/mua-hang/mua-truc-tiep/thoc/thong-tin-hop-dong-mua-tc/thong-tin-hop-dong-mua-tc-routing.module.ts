import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThongTinHopDongMuaTCComponent } from './thong-tin-hop-dong-mua-tc.component';

const routes: Routes = [
  {
    path: '',
    component: ThongTinHopDongMuaTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThongTinHopDongMuaTCRoutingModule {}
