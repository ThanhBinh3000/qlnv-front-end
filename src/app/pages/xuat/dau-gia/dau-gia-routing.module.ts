import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DauGiaComponent } from './dau-gia.component';

const routes: Routes = [
  {
    path: '',
    component: DauGiaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauGiaRoutingModule { }
