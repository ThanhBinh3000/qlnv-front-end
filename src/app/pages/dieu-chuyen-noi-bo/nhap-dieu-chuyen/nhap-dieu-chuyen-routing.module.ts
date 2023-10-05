import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapDieuChuyenComponent } from './nhap-dieu-chuyen.component';

const routes: Routes = [
  {
    path: '',
    component: NhapDieuChuyenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapDieuChuyenRoutingModule { }
