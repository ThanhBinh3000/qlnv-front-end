import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XuatHangThanhLyComponent } from './xuat-hang-thanh-ly.component';


const routes: Routes = [
  {
    path: '',
    component: XuatHangThanhLyComponent,
    children: [
      {
        path: '',
        redirectTo: 'kiem-tra-lt',
        pathMatch: 'full',
      },
      // Region tổ chức thanh lý
      {
        path: 'kiem-tra-lt',
        loadChildren: () =>
          import(
            '../xuat-hang-thanh-ly/kiem-tra/kiem-tra.module'
            ).then((m) => m.KiemTraModule),
      },
      {
        path: 'kiem-tra-vt',
        loadChildren: () =>
          import(
            '../xuat-hang-thanh-ly/kiem-tra/kiem-tra.module'
            ).then((m) => m.KiemTraModule),
      },
      // Region xuất hàng thanh lý
      {
        path: 'xuat-kho-lt',
        loadChildren: () =>
          import(
            '../xuat-hang-thanh-ly/xuat-kho/xuat-kho.module'
            ).then((m) => m.XuatKhoModule),
      },
      {
        path: 'xuat-kho-vt',
        loadChildren: () =>
          import(
            '../xuat-hang-thanh-ly/xuat-kho/xuat-kho.module'
            ).then((m) => m.XuatKhoModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatHangThanhLyRoutingModule { }
