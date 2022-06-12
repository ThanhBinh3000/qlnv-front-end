import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThanhToanChoKhachHangComponent } from './thanh-toan-cho-khach-hang.component';

const routes: Routes = [
  {
    path: '',
    component: ThanhToanChoKhachHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThanhToanChoKhachHangRoutingModule {}
