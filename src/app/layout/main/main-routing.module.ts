import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from 'src/app/pages/index/index.component';
import { QuantriComponent } from 'src/app/pages/quantri/quantri.component';
import { MAIN_ROUTES } from './main-routing.constant';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'quantri',
        pathMatch: 'full',
      },
      {
        path: MAIN_ROUTES.quantri,
        component: QuantriComponent,
      },
      {
        path: MAIN_ROUTES.kehoach,
        component: QuantriComponent,
      },
      {
        path: MAIN_ROUTES.tacVuThuongXuyen,
        component: QuantriComponent,
      },
      {
        path: MAIN_ROUTES.baoCaoNghiepVu,
        component: QuantriComponent,
      },
      {
        path: MAIN_ROUTES.heThong,
        component: QuantriComponent,
      },
      {
        path: MAIN_ROUTES.danhMuc,
        component: QuantriComponent,
      },
      {
        path: 'quantri',
        loadChildren: () =>
          import('../../pages/quantri/quantri.module').then(
            (m) => m.QuantriModule,
          ),
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
