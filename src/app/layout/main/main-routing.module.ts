import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from 'src/app/pages/index/index.component';
import { QuantriComponent } from 'src/app/pages/quantri/quantri.component';
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
        path: 'quantri',
        component: QuantriComponent,
      },
      {
        path: 'quantri',
        loadChildren: () =>
          import('../../pages/quantri/quantri.module').then(
            (m) => m.QuantriModule,
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
