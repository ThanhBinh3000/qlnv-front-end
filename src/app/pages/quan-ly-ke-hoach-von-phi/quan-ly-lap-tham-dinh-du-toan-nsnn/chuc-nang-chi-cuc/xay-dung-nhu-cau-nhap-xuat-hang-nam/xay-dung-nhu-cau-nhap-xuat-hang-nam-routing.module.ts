import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XayDungNhuCauNhapXuatHangNamComponent } from './xay-dung-nhu-cau-nhap-xuat-hang-nam.component';

const routes: Routes = [
  {
    path: '',
    component: XayDungNhuCauNhapXuatHangNamComponent
    ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XayDungNhuCauNhapXuatHangNamRoutingModule {}
