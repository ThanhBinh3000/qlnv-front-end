import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapComponent } from './nhap.component';

const routes: Routes = [
  {
    path: '',
    component: NhapComponent,
    children: [
      {
        path: 'dau-thau',
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
export class NhapRoutingModule { }
