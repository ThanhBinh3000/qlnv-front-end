import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiemSoatQuyenTruyCapComponent } from './kiem-soat-quyen-truy-cap/kiem-soat-quyen-truy-cap.component';
import { QuanLyCanBoComponent } from './quan-ly-can-bo/quan-ly-can-bo.component';
import { QuanLyNhomQuyenComponent } from './quan-ly-nhom-quyen/quan-ly-nhom-quyen.component';
import { QuanLyQuyenComponent } from './quan-ly-quyen/quan-ly-quyen.component';
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
      {
        path: 'quan-ly-quyen',
        component: QuanLyQuyenComponent,
      },
      {
        path: 'quan-ly-nhom-quyen',
        component: QuanLyNhomQuyenComponent,
      },
      {
        path: 'kiem-soat-truy-cap',
        component: KiemSoatQuyenTruyCapComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanTriHeThongNewRoutingModule { }
