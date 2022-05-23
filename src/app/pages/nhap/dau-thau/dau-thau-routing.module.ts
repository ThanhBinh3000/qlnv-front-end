import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NHAP_THEO_PHUONG_THUC_DAU_THAU } from '../nhap.constant';
import { DauThauComponent } from './dau-thau.component';

const routes: Routes = [
  {
    path: '',
    component: DauThauComponent,
    children: [
      {
        path: '',
        redirectTo: `${NHAP_THEO_PHUONG_THUC_DAU_THAU}`,
        pathMatch: 'full',
      },
      {
        path: `${NHAP_THEO_PHUONG_THUC_DAU_THAU}`,
        loadChildren: () =>
          import(
            './nhap-theo-phuong-thuc-dau-thau/nhap-theo-phuong-thuc-dau-thau.module'
          ).then((m) => m.NhapTheoPhuongThucDauThauModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule { }
