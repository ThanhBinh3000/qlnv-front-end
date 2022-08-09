import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyCanBoComponent } from './quan-ly-can-bo/quan-ly-can-bo.component';
import { QuanTriHeThongNewComponent } from './quan-tri-he-thong.component';

const routes: Routes = [
  {
    path: '',
    component: QuanTriHeThongNewComponent,
    children: [
      {
        path: '',
        redirectTo: 'quan-ly-can-bo',
        pathMatch: 'full',
      },
      {
        path: 'quan-ly-can-bo',
        component: QuanLyCanBoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanTriHeThongNewRoutingModule { }
