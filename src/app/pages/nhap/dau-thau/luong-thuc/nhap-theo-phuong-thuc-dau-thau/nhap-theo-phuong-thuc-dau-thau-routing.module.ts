import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapTheoPhuongThucDauThauComponent } from './nhap-theo-phuong-thuc-dau-thau.component';
import { ThemmoiQdinhNhapXuatHangComponent } from './themmoi-qdinh-nhap-xuat-hang/themmoi-qdinh-nhap-xuat-hang.component';

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
    path: ':type/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-hang/:id',
    component: ThemmoiQdinhNhapXuatHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapTheoPhuongThucDauThauRoutingModule {}
