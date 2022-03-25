import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuToanChiUngDungCntt3NamComponent } from './du-toan-chi-ung-dung-cntt-3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: DuToanChiUngDungCntt3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuToanChiUngDungCntt3NamRoutingModule {}
