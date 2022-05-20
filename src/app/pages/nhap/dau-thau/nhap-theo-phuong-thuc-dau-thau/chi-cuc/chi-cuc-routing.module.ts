import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiCucComponent } from './chi-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: ChiCucComponent,
    children: [
      {
        path: 'danh-sach',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '',
        component: ChiCucComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChiCucRoutingModule { }
