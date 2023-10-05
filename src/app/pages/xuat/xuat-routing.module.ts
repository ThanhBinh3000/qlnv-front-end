import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {XuatComponent} from './xuat.component';
import {XuatKhacModule} from "./xuat-khac/xuat-khac.module";

const routes: Routes = [
  {
    path: '',
    component: XuatComponent,
    children: [
      {
        path: '',
        redirectTo: `cuu-tro-vien-tro`,
        pathMatch: 'full',
      },
      {
        path: 'cuu-tro-vien-tro',
        loadChildren: () =>
          import('./xuat-cuu-tro-vien-tro/xuat-cuu-tro-vien-tro.module').then((m) => m.XuatCuuTroVienTroModule),
      },
      {
        path: 'dau-gia',
        loadChildren: () =>
          import('./dau-gia/dau-gia.module').then((m) => m.DauGiaModule),
      },
      {
        path: 'xuat-truc-tiep',
        loadChildren: () =>
          import('./xuat-truc-tiep/xuat-truc-tiep.module').then((m) => m.XuatTrucTiepModule),
      },
      {
        path: 'xuat-thanh-ly',
        loadChildren: () =>
          import('./xuat-thanh-ly/xuat-thanh-ly.module').then((m) => m.XuatThanhLyModule),
      },
      {
        path: 'xuat-khac',
        loadChildren: () =>
          import('./xuat-khac/xuat-khac.module').then((m) => m.XuatKhacModule),
      },
      {
        path: 'xuat-tieu-huy',
        loadChildren: () =>
          import('./xuat-tieu-huy/xuat-tieu-huy.module').then((m) => m.XuatTieuHuyModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XuatRoutingModule {
}
