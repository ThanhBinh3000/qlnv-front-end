import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuToanChiDuTruQuocGiaGd3NamComponent } from './du-toan-chi-du-tru-quoc-gia-gd3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: DuToanChiDuTruQuocGiaGd3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuToanChiDuTruQuocGiaGd3NamRoutingModule {}
