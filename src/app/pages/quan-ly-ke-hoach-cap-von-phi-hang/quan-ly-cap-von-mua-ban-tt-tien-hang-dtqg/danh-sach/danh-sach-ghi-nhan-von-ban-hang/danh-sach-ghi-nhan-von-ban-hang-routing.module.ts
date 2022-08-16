import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachGhiNhanVonBanHangComponent } from './danh-sach-ghi-nhan-von-ban-hang.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachGhiNhanVonBanHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachGhiNhanVonBanHangRoutingModule {}
