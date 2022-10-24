import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhuongAnGiaComponent } from './phuong-an-gia.component';

const routes: Routes = [
  {
    path: '',
    component: PhuongAnGiaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhuongAnGiaRoutingModule { }
