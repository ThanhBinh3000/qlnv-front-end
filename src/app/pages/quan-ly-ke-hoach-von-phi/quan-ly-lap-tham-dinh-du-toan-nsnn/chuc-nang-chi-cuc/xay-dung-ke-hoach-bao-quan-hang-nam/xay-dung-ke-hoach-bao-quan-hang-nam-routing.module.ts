import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XayDungKeHoachBaoQuanHangNamComponent } from './xay-dung-ke-hoach-bao-quan-hang-nam.component';

const routes: Routes = [
  {
    path: '',
    component: XayDungKeHoachBaoQuanHangNamComponent
    ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XayDungKeHoachBaoQuanHangNamRoutingModule {}
