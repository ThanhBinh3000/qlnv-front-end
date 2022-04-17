import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DauThauComponent } from './dau-thau.component';


const routes: Routes = [
  {
    path: '',
    component: DauThauComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach-dau-thau',
        pathMatch: 'full',
      },
      {
        path: 'gao',
        loadChildren: () =>
          import('../dau-thau/gao/gao.module').then((m) => m.GaoModule),
      },
      {
        path: 'muoi',
        loadChildren: () =>
          import('../dau-thau/muoi/muoi.module').then((m) => m.MuoiModule),
      },
      {
        path: 'thoc',
        loadChildren: () =>
          import('../dau-thau/thoc/thoc.module').then((m) => m.ThocModule),
      },
      {
        path: 'vat-tu',
        loadChildren: () =>
          import('../dau-thau/vat-tu/vat-tu.module').then((m) => m.VatTuModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule { }
