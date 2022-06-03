import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoKiemTraTranChiTuBtcComponent } from './so-kiem-tra-tran-chi-tu-btc.component';

const routes: Routes = [
  {
    path: '',
    component: SoKiemTraTranChiTuBtcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoKiemTraTranChiTuBtcRoutingModule {}
