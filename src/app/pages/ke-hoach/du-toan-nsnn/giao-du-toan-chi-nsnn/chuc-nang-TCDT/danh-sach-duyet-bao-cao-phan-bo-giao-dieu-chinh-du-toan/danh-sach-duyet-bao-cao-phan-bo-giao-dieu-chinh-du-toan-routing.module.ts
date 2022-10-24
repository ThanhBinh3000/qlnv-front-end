import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanComponent } from './danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanRoutingModule {}
