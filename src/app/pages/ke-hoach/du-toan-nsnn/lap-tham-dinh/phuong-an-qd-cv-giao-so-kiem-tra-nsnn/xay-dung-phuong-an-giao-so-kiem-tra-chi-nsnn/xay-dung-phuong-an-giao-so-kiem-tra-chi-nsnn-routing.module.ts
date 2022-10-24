import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XayDungPhuongAnGiaoSoKiemTraChiNsnnComponent } from './xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: XayDungPhuongAnGiaoSoKiemTraChiNsnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XayDungPhuongAnGiaoSoKiemTraChiNsnnRoutingModule {}
