import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemSoKiemTraChiNsnnComponent } from './tim-kiem-so-kiem-tra-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemSoKiemTraChiNsnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemSoKiemTraChiNsnnRoutingModule {}
