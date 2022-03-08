import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XayDungKeHoachQuyTienLuongHangNamComponent } from './xay-dung-ke-hoach-quy-tien-luong-hang-nam.component';

const routes: Routes = [
  {
    path: '',
    component: XayDungKeHoachQuyTienLuongHangNamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XayDungKeHoachQuyTienLuongHangNamRoutingModule {}
