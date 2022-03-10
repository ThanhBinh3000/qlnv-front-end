import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachQuyTienLuongNamN1Component } from './ke-hoach-quy-tien-luong-nam-n1.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachQuyTienLuongNamN1Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachQuyTienLuongNamN1RoutingModule {}
