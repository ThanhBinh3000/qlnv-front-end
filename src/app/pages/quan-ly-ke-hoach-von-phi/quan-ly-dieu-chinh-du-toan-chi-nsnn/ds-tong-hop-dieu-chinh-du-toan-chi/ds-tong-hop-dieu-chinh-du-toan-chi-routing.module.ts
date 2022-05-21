import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsTongHopDieuChinhDuToanChiComponent } from './ds-tong-hop-dieu-chinh-du-toan-chi.component';

const routes: Routes = [
  {
    path: '',
    component: DsTongHopDieuChinhDuToanChiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsTongHopDieuChinhDuToanChiRoutingModule {}
