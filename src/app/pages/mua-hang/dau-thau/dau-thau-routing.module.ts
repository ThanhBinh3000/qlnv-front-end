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
        redirectTo: 'kehoach-luachon-nhathau',
        pathMatch: 'full',
      },
      {
        path: 'kehoach-luachon-nhathau',
        loadChildren: () =>
          import('../dau-thau/kehoach-luachon-nhathau/kehoach-luachon-nhathau.module').then((m) => m.KehoachLuachonNhathauModule),
      },
      {
        path: 'trienkhai-luachon-nhathau',
        loadChildren: () =>
          import('../dau-thau/trienkhai-luachon-nhathau/trienkhai-luachon-nhathau.module').then((m) => m.TrienkhaiLuachonNhathauModule),
      },
      {
        path: 'dieuchinh-luachon-nhathau',
        loadChildren: () =>
          import('../dau-thau/dieuchinh-luachon-nhathau/dieuchinh-luachon-nhathau.module').then((m) => m.DieuchinhLuachonNhathauModule),
      },
      {
        path: 'thoc',
        loadChildren: () =>
          import('../dau-thau/thoc/thoc.module').then((m) => m.ThocModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule { }
