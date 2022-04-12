import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaoCaoTongCucKhoachPhanBoComponent } from './bao-cao-tong-cuc-khoach-phan-bo.component';

const routes: Routes = [
  {
    path: '',
    component: BaoCaoTongCucKhoachPhanBoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaoCaoTongCucKhoachPhanBoRoutingModule {}
