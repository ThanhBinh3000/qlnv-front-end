import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachVanBanGuiTcdtVeDuToanNsnnComponent } from './danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachVanBanGuiTcdtVeDuToanNsnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachVanBanGuiTcdtVeDuToanNsnnRoutingModule {}
