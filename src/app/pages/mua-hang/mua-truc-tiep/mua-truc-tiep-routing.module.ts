import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuaTrucTiepComponent } from './mua-truc-tiep.component';


const routes: Routes = [
  {
    path: '',
    component: MuaTrucTiepComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach-mua-truc-tiep',
        pathMatch: 'full',
      },
      {
        path: 'gao',
        loadChildren: () =>
          import('../mua-truc-tiep/gao/gao.module').then((m) => m.GaoModule),
      },
      {
        path: 'muoi',
        loadChildren: () =>
          import('../mua-truc-tiep/muoi/muoi.module').then((m) => m.MuoiModule),
      },
      {
        path: 'thoc',
        loadChildren: () =>
          import('../mua-truc-tiep/thoc/thoc.module').then((m) => m.ThocModule),
      },
      {
        path: 'vat-tu',
        loadChildren: () =>
          import('../mua-truc-tiep/vat-tu/vat-tu.module').then((m) => m.VatTuModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MuaTrucTiepRoutingModule { }
