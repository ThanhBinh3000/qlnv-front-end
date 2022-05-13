import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhMucDonViComponent } from './danh-muc-don-vi/danh-muc-don-vi.component';
import { DanhMucComponent } from './danh-muc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhMucComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-muc-don-vi',
        pathMatch: 'full',
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
export class DanhMucRoutingModule { }
