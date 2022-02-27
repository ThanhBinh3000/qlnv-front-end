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
        path: MAIN_ROUTES.kehoach,
        loadChildren: () =>
          import('../../pages/ke-hoach/ke-hoach.module').then(
            (m) => m.KeHoachModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
