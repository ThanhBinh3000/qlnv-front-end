import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuToanPhiXuatHangDtqgHangNamVtctComponent } from './du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.component';

const routes: Routes = [
  {
    path: '',
    component: DuToanPhiXuatHangDtqgHangNamVtctComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuToanPhiXuatHangDtqgHangNamVtctRoutingModule {}
