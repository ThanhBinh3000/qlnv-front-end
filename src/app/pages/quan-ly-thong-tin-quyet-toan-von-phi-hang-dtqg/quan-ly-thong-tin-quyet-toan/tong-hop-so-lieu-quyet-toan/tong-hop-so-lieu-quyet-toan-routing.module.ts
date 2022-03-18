import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopSoLieuQuyetToanComponent } from './tong-hop-so-lieu-quyet-toan.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopSoLieuQuyetToanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TongHopSoLieuQuyetToanRoutingModule {}
