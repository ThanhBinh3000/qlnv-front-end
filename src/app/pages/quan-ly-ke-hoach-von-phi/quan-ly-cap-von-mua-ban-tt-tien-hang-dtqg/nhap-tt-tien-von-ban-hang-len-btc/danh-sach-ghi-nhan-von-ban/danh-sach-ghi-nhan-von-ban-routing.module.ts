import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachGhiNhanVonBanComponent } from './danh-sach-ghi-nhan-von-ban.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachGhiNhanVonBanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachGhiNhanVonBanRoutingModule {}
