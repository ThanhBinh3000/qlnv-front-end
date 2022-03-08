import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XayDungKeHoachQuyTienLuong3NamComponent } from './xay-dung-ke-hoach-quy-tien-luong3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: XayDungKeHoachQuyTienLuong3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XayDungKeHoachQuyTienLuong3NamRoutingModule {}
