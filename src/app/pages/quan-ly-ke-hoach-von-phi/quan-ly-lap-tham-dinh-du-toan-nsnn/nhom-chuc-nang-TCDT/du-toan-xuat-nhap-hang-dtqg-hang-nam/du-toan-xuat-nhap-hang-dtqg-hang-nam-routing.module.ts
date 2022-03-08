import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuToanXuatNhapHangDtqgHangNamComponent } from './ du-toan-xuat-nhap-hang-dtqg-hang-nam.component';

const routes: Routes = [
  {
    path: '',
    component: DuToanXuatNhapHangDtqgHangNamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuToanXuatNhapHangDtqgHangNamRoutingModule {}
