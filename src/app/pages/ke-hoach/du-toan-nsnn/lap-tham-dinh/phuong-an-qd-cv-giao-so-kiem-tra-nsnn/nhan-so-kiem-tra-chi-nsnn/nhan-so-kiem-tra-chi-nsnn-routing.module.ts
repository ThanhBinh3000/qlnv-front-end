import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhanSoKiemTraChiNsnnComponent } from './nhan-so-kiem-tra-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: NhanSoKiemTraChiNsnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhanSoKiemTraChiNsnnRoutingModule {}
