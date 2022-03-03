import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhMucComponent } from './danh-muc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhMucComponent,
    children: [
      {
        path: '',
        redirectTo: 'nguoi-dung',
        pathMatch: 'full',
      },
      {
        path: 'danh-muc-don-vi',
        loadChildren: () =>
          import(
            '../danh-muc/danh-muc-don-vi/danh-muc-don-vi.module'
          ).then((m) => m.DanhMucDonViModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhMucRoutingModule { }
