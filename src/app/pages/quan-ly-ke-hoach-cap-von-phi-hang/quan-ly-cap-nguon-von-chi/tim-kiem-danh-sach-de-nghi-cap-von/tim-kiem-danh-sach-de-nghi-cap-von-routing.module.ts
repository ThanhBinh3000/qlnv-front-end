import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemDanhSachDeNghiCapVonComponent } from './tim-kiem-danh-sach-de-nghi-cap-von.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemDanhSachDeNghiCapVonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemDanhSachDeNghiCapVonRoutingModule {}
