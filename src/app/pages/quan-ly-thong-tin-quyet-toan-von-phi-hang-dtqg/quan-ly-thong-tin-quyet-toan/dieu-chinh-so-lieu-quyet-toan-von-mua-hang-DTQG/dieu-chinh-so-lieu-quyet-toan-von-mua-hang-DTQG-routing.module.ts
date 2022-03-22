import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DieuChinhSoLieuQuyetToanVonMuaHangDTQGComponent } from './dieu-chinh-so-lieu-quyet-toan-von-mua-hang-DTQG.component';
const routes: Routes = [
  {
    path: '',
    component: DieuChinhSoLieuQuyetToanVonMuaHangDTQGComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DieuChinhSoLieuQuyetToanVonMuaHangDTQGRoutingModule {}
