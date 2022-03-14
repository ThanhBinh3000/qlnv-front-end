import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapQdinhPboGiaoDtoanChiNsnnComponent } from './nhap-qdinh-pbo-giao-dtoan-chi-nsnn.component';
const routes: Routes = [
  {
    path: '',
    component: NhapQdinhPboGiaoDtoanChiNsnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapQdinhPboGiaoDtoanChiNsnnRoutingModule {}
