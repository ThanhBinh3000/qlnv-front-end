import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsChiTietNhapLieuBaoCaoComponent } from './ds-chi-tiet-nhap-lieu-bao-cao.component';

const routes: Routes = [
  {
    path: '',
    component: DsChiTietNhapLieuBaoCaoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsChiTietNhapLieuBaoCaoRoutingModule {}
