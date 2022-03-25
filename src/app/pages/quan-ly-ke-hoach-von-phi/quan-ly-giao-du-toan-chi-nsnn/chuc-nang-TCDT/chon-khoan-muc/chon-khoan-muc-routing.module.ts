import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChonKhoanMucComponent } from './chon-khoan-muc.component';
const routes: Routes = [
  {
    path: '',
    component: ChonKhoanMucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChonKhoanMucComponentRoutingModule {}
