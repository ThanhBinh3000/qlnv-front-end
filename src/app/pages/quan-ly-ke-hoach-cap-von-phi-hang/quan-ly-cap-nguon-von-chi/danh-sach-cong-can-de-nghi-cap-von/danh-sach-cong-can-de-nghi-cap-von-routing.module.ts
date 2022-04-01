import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachCongVanDeNghiCapVonComponent } from './danh-sach-cong-can-de-nghi-cap-von.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachCongVanDeNghiCapVonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachCongVanDeNghiCapVonComponentRoutingModule {}
