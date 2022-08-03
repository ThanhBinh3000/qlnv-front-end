import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhMucDungChungComponent } from './danh-muc-dung-chung/danh-muc-dung-chung.component';
import { QuanTriDanhMucComponent } from './quantridanhmuc.component';

const routes: Routes = [
  {
    path: '',
    component: QuanTriDanhMucComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-muc-dung-chung',
        pathMatch: 'full',
      },
      {
        path: 'danh-muc-dung-chung',
        component: DanhMucDungChungComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanTriDanhMucRoutingModule { }
