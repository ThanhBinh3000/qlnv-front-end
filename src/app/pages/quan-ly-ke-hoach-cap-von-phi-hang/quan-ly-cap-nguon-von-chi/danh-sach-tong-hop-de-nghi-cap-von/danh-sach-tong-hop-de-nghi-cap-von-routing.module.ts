import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachTongHopDeNghiCapVonComponent } from './danh-sach-tong-hop-de-nghi-cap-von.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachTongHopDeNghiCapVonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachTongHopDeNghiCapVonRoutingModule {}
