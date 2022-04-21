import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThongTinMuaTrucTiepTCComponent } from './thong-tin-mua-truc-tiep-tc.component';

const routes: Routes = [
  {
    path: '',
    component: ThongTinMuaTrucTiepTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThongTinMuaTrucTiepTCRoutingModule {}
