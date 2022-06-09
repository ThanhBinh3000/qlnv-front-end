import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachNhapVonBanHangComponent } from './danh-sach-nhap-von-ban-hang.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachNhapVonBanHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachNhapVonBanHangRoutingModule {}
