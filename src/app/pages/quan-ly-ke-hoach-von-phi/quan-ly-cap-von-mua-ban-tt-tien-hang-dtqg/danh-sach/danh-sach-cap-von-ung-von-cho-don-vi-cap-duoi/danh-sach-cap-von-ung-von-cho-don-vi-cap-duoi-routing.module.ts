import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachCapVonUngVonChoDonViCapDuoiComponent } from './danh-sach-cap-von-ung-von-cho-don-vi-cap-duoi.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachCapVonUngVonChoDonViCapDuoiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachCapVonUngVonChoDonViCapDuoiRoutingModule {}
