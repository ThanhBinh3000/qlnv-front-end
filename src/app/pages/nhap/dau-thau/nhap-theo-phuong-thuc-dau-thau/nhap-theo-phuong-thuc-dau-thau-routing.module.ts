import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapTheoPhuongThucDauThauComponent } from './nhap-theo-phuong-thuc-dau-thau.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'thoc',
    pathMatch: 'full',
  },
  {
    path: ':type',
    component: NhapTheoPhuongThucDauThauComponent,
  },
  {
    path: ':type',
    loadChildren: () =>
      import('../../../nhap/dau-thau/nhap-theo-phuong-thuc-dau-thau/cuc/cuc.module').then((m) => m.CucModule),
  },
  {
    path: ':type',
    loadChildren: () =>
      import('../../../nhap/dau-thau/nhap-theo-phuong-thuc-dau-thau/chi-cuc/chi-cuc.module').then((m) => m.ChiCucModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapTheoPhuongThucDauThauRoutingModule { }
