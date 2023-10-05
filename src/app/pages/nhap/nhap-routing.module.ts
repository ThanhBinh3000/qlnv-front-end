import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { NhapComponent } from './nhap.component';
import { MUA_TRUC_TIEP, NHAP_KHAC, NHAP_THEO_KE_HOACH } from "./nhap.constant";

const routes: Routes = [
  {
    path: '',
    component: NhapComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: `${NHAP_THEO_KE_HOACH}`,
        pathMatch: 'full',
      },
      {
        path: `${NHAP_THEO_KE_HOACH}`,
        loadChildren: () =>
          import('../nhap/dau-thau/dau-thau.module').then(
            (m) => m.DauThauModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: `${MUA_TRUC_TIEP}`,
        loadChildren: () =>
          import('../nhap/mua-truc-tiep/mua-truc-tiep.module').then(
            (m) => m.MuaTrucTiepModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: `${NHAP_KHAC}`,
        loadChildren: () =>
          import('../nhap/khac/khac.module').then(
            (m) => m.KhacModule,
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapRoutingModule { }
