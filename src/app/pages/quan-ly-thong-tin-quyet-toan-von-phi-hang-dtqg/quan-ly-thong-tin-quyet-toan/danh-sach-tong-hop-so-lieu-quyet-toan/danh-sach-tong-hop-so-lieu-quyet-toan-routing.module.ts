import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachTongHopSoLieuQuyetToanComponent } from './danh-sach-tong-hop-so-lieu-quyet-toan.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachTongHopSoLieuQuyetToanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachTongHopSoLieuQuyetToanRoutingModule {}
