import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnComponent } from './tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnRoutingModule {}
