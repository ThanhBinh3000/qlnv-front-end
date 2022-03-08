import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhuCauXuatHangVienTroComponent } from './nhu-cau-xuat-hang-vien-tro.component';

const routes: Routes = [
  {
    path: '',
    component: NhuCauXuatHangVienTroComponent
    ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhuCauXuatHangVienTroRoutingModule {}
