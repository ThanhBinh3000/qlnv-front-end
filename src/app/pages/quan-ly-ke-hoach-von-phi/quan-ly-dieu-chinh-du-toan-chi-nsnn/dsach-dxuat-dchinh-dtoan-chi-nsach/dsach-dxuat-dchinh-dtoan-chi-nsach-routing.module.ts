import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsachDxuatDchinhDtoanChiNsachComponent } from './dsach-dxuat-dchinh-dtoan-chi-nsach.component';

const routes: Routes = [
  {
    path: '',
    component: DsachDxuatDchinhDtoanChiNsachComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsachDxuatDchinhDtoanChiNsachRoutingModule {}
