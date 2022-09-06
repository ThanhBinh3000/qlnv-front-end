import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhMucDonViComponent } from './danh-muc-don-vi/danh-muc-don-vi.component';
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
      {
        path: 'danh-muc-don-vi',
        component: DanhMucDonViComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanTriDanhMucRoutingModule { }
