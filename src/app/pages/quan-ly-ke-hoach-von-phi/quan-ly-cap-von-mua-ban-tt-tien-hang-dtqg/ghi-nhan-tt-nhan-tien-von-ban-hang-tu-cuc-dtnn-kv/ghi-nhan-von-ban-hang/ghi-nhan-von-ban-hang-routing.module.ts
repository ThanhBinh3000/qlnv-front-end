import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanVonBanHangComponent } from './ghi-nhan-von-ban-hang.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanVonBanHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanVonBanHangRoutingModule {}
