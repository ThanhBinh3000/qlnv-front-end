import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QdCvGiaoSoKiemTraTranChiNsnnComponent } from './qd-cv-giao-so-kiem-tra-tran-chi-nsnn.component';
const routes: Routes = [
  {
    path: '',
    component: QdCvGiaoSoKiemTraTranChiNsnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QdCvGiaoSoKiemTraTranChiNsnnRoutingModule {}
