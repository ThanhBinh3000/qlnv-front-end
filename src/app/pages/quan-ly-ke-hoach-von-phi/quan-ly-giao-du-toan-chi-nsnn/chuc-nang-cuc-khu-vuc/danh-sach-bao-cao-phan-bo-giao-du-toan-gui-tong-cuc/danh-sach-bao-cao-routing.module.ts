import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachBaoCaoComponent } from './danh-sach-bao-cao.component';
const routes: Routes = [
  {
    path: '',
    component: DanhSachBaoCaoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachBaoCaoRoutingModule {}
