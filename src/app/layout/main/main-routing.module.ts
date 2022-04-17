import { KeHoachModule } from './../../pages/ke-hoach/ke-hoach.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from 'src/app/pages/index/index.component';
import { MAIN_ROUTES } from './main-routing.constant';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'kehoach',
        pathMatch: 'full',
      },
      {
        path: MAIN_ROUTES.nhap,
        loadChildren: () =>
          import('../../pages/nhap/nhap.module').then((m) => m.NhapModule),
      },
      {
        path: MAIN_ROUTES.xuat,
        loadChildren: () =>
          import('../../pages/xuat/xuat.module').then((m) => m.XuatModule),
      },
      {
        path: MAIN_ROUTES.muaHang,
        loadChildren: () =>
          import('../../pages/mua-hang/mua-hang.module').then((m) => m.MuaHangModule),
      },
      {
        path: MAIN_ROUTES.luuKho,
        loadChildren: () =>
          import('../../pages/luu-kho/luu-kho.module').then((m) => m.LuuKhoModule),
      },
      {
        path: MAIN_ROUTES.kehoach,
        loadChildren: () =>
          import('../../pages/ke-hoach/ke-hoach.module').then(
            (m) => m.KeHoachModule,
          ),
      },
      {
        path: MAIN_ROUTES.danhMuc,
        loadChildren: () =>
          import('../../pages/danh-muc/danh-muc.module').then(
            (m) => m.DanhMucModule,
          ),
      },
      {
        path: MAIN_ROUTES.quantrihethong,
        loadChildren: () =>
          import('../../pages/quantrihethong/quantrihethong.module').then(
            (m) => m.QuanTriHeThongModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
