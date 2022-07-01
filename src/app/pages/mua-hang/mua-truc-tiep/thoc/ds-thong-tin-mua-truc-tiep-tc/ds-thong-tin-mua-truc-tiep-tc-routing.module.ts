import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsThongTinMuaTrucTiepTCComponent } from './ds-thong-tin-mua-truc-tiep-tc.component';

const routes: Routes = [
  {
    path: '',
    component: DsThongTinMuaTrucTiepTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsThongTinMuaTrucTiepTCRoutingModule {}
