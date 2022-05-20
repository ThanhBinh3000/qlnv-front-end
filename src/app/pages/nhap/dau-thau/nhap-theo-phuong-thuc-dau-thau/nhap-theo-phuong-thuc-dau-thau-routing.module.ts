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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapTheoPhuongThucDauThauRoutingModule {}
