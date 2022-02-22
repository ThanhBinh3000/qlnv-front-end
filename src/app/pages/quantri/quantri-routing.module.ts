import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuantriComponent } from './quantri.component';

const routes: Routes = [
  {
    path: '',
    component: QuantriComponent,
    children: [
      {
        path: '',
        redirectTo: 'nguoi-dung',
        pathMatch: 'full'
      },
      {
        path: 'don-vi',
        loadChildren: () => import('../../pages/quantri/donvi/donvi.module').then(m => m.DonviModule)
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuantriRoutingModule { }
