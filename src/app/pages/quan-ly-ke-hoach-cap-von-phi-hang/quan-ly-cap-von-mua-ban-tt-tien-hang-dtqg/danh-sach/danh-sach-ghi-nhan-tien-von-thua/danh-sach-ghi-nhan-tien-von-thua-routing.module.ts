import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachGhiNhanTienVonThuaComponent } from './danh-sach-ghi-nhan-tien-von-thua.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachGhiNhanTienVonThuaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachGhiNhanTienVonThuaRoutingModule {}
