import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachComponent } from './danhsach/danhsach.component';
import { QlLsTruyCapComponent } from './ql-ls-truycap/ql-ls-truycap.component';
import { QlNhomQuyenComponent } from './ql-nhomquyen/ql-nhomquyen.component';
import { QlQuyenComponent } from './ql-quyen/ql-quyen.component';
import { QlThamSoHeThongComponent } from './ql-ts-hethong/ql-ts-hethong.component';
import { QuanTriHeThongComponent } from './quantrihethong.component';

const routes: Routes = [
  {
    path: '',
    component: QuanTriHeThongComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach',
        pathMatch: 'full',
      },
      {
        path: 'danh-sach',
        component: DanhSachComponent,
      },
      {
        path: 'ql-quyen',
        component: QlQuyenComponent,
      },
      {
        path: 'ql-nhomquyen',
        component: QlNhomQuyenComponent,
      },
      {
        path: 'lichsu-truycap',
        component: QlLsTruyCapComponent,
      },
      {
        path: 'thamso-hethong',
        component: QlThamSoHeThongComponent,
      },
      // {
      //   path: 'danh-sach',
      //   loadChildren: () =>
      //     import('./danhsach/danhsach.module').then(
      //       (m) => m.DanhSachModule,
      //     ),
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanTriHeThongRoutingModule { }
