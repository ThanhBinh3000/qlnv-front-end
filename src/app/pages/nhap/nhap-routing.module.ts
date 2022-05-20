import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapComponent } from './nhap.component';
import { NHAP_THEO_KE_HOACH } from './nhap.constant';

const routes: Routes = [
  {
    path: '',
    component: NhapComponent,
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
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapRoutingModule {}
