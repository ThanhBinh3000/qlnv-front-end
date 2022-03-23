import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachDeXuatDieuChinhDuToanChiNganSachComponent } from './danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachDeXuatDieuChinhDuToanChiNganSachComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachDeXuatDieuChinhDuToanChiNganSachRoutingModule {}
