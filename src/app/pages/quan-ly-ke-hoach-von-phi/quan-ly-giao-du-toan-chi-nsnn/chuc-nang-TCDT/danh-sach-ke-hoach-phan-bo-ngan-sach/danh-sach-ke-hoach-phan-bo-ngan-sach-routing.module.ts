import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachKeHoachPhanBoNganSachComponent } from './danh-sach-ke-hoach-phan-bo-ngan-sach.component';
const routes: Routes = [
  {
    path: '',
    component: DanhSachKeHoachPhanBoNganSachComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachKeHoachPhanBoNganSachRoutingModule {}
