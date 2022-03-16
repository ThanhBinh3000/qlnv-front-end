import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachDieuChinhSoLieuSauQuyetToanComponent } from './danh-sach-dieu-chinh-so-lieu-sau-quyet-toan.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachDieuChinhSoLieuSauQuyetToanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachDieuChinhSoLieuSauQuyetToanRoutingModule {}
