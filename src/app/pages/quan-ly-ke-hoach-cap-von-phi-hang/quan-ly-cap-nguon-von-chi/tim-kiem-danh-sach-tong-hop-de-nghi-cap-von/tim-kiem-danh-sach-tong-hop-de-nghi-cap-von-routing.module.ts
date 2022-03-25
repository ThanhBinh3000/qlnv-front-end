import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemDanhSachTongHopDeNghiCapVonComponent } from './tim-kiem-danh-sach-tong-hop-de-nghi-cap-von.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemDanhSachTongHopDeNghiCapVonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemDanhSachTongHopDeNghiCapVonRoutingModule {}
