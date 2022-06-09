import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanTaiTongCucComponent } from './ghi-nhan-tai-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanTaiTongCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanTaiTongCucRoutingModule {}
