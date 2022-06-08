import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoKiemTraChiNsnnComponent } from './so-kiem-tra-chi-nsnn.component';
const routes: Routes = [
  {
    path: '',
    component: SoKiemTraChiNsnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoKiemTraChiNsnnRoutingModule {}
