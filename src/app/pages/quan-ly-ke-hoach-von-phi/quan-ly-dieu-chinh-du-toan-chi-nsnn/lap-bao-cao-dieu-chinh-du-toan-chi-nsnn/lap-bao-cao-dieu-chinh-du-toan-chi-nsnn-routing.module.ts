import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapBaoCaoDieuChinhDuToanChiNsnnComponent } from './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: LapBaoCaoDieuChinhDuToanChiNsnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapBaoCaoDieuChinhDuToanChiNsnnRoutingModule {}
