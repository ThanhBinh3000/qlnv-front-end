import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemDanhSachDeNghiCapVonBoNganhComponent } from './tim-kiem-danh-sach-de-nghi-cap-von-bo-nganh.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemDanhSachDeNghiCapVonBoNganhComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemDanhSachDeNghiCapVonBoNganhRoutingModule {}
