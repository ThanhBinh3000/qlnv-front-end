import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XuatHangComponent } from './xuat-hang.component';
import { QuyetDinhXhComponent } from './quyet-dinh-xh/quyet-dinh-xh.component';
import { PhieuXuatKhoComponent } from './phieu-xuat-kho/phieu-xuat-kho.component';
import { BangKeComponent } from './bang-ke/bang-ke.component';

const routes: Routes = [
  {
    path: '',
    component: XuatHangComponent,
    children: [
      {
        path: '',
        redirectTo: 'giao-nv-xh',
        pathMatch: 'full',
      },
      {
        path: 'giao-nv-xh',
        component: QuyetDinhXhComponent
      },
      {
        path: 'phieu-xuat-kho',
        component: PhieuXuatKhoComponent
      },
      {
        path: 'bang-ke',
        component: BangKeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatHangRoutingModule { }
