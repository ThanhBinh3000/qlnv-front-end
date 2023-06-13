import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapHangComponent } from './nhap-hang.component';

const routes: Routes = [
  {
    path: '',
    component: NhapHangComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'giao-nv-xh',
      //   pathMatch: 'full',
      // },
      // {
      //   path: 'giao-nv-xh',
      //   component: QuyetDinhXhComponent
      // },
      // {
      //   path: 'phieu-xuat-kho',
      //   component: PhieuXuatKhoComponent
      // },
      // {
      //   path: 'bang-ke',
      //   component: BangKeComponent
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhapHangRoutingModule { }
