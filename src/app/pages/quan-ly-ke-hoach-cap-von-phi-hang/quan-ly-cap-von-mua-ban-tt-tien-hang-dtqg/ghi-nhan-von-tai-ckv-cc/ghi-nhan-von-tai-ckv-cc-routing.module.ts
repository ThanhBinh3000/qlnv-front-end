import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanVonTaiCkvCcComponent } from './ghi-nhan-von-tai-ckv-cc.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanVonTaiCkvCcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanVonTaiCkvCcRoutingModule {}
