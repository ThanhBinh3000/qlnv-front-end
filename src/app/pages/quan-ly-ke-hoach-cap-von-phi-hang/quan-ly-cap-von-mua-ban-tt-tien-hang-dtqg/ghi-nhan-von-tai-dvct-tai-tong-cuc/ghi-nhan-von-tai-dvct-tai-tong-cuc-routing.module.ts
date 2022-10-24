import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanVonTaiDvctTaiTongCucComponent } from './ghi-nhan-von-tai-dvct-tai-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanVonTaiDvctTaiTongCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanVonTaiDvctTaiTongCucRoutingModule {}
