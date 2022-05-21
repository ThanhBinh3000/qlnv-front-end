import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiCucComponent } from './chi-cuc.component';
import { ChiTietNhapTheoPhuongThucDauThauComponent } from './chi-tiet-nhap-theo-phuong-thuc-dau-thau/chi-tiet-nhap-theo-phuong-thuc-dau-thau.component';

const routes: Routes = [
  {
    path: '',
    component: ChiCucComponent,
    children: [
      {
        path: 'danh-sach',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '',
        component: ChiCucComponent,
      },
      {
        path: 'chi-tiet/:id',
        loadChildren: () =>
          import('../../../../nhap/dau-thau/nhap-theo-phuong-thuc-dau-thau/chi-cuc/chi-tiet-nhap-theo-phuong-thuc-dau-thau/chi-tiet-nhap-theo-phuong-thuc-dau-thau.module').then((m) => m.ChiTietNhapTheoPhuongThucDauThauModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChiCucRoutingModule { }
