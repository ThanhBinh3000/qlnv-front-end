import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachDeNghiCapVonComponent } from './danh-sach-de-nghi-cap-von.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachDeNghiCapVonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachDeNghiCapVonComponentRoutingModule {}
