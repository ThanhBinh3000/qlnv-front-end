import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsQuyetDinhMuaTrucTiepTCComponent } from './ds-quyet-dinh-phe-duyet-mua-truc-tiep-tc.component';

const routes: Routes = [
  {
    path: '',
    component: DsQuyetDinhMuaTrucTiepTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsQuyetDinhMuaTrucTiepTCRoutingModule {}
