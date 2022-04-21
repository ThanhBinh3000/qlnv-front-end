import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThongTinQDPheDuyetKhMuaTrucTiepTCComponent } from './thong-tin-qd-phe-duyet-kh-mua-truc-tiep-tc.component';

const routes: Routes = [
  {
    path: '',
    component: ThongTinQDPheDuyetKhMuaTrucTiepTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThongTinQDPheDuyetKhMuaTrucTiepTCRoutingModule {}
