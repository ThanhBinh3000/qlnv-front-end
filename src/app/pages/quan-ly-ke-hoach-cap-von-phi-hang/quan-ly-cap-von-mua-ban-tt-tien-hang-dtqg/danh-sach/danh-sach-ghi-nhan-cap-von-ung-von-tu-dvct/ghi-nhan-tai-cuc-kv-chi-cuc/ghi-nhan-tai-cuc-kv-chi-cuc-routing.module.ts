import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanTaiCucKvChiCucComponent } from './ghi-nhan-tai-cuc-kv-chi-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanTaiCucKvChiCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanTaiCucKvChiCucRoutingModule {}
