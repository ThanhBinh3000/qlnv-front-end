import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapPhuongAnPhanBoDuToanChiNsnnChoDviComponent } from './lap-phuong-an-phan-bo-du-toan-chi-nsnn-cho-dvi.component';
const routes: Routes = [
  {
    path: '',
    component: LapPhuongAnPhanBoDuToanChiNsnnChoDviComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapPhuongAnPhanBoDuToanChiNsnnChoDviRoutingModule {}
