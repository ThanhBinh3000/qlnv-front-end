import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanTtNopTienVonBanHangComponent } from './ghi-nhan-tt-nop-tien-von-ban-hang.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanTtNopTienVonBanHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanTtNopTienVonBanHangRoutingModule {}
