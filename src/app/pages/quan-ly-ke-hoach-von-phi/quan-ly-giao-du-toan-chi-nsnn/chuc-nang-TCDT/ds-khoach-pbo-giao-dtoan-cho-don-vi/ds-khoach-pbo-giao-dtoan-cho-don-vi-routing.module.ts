import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsKhoachPboGiaoDtoanChoDonViComponent } from './ds-khoach-pbo-giao-dtoan-cho-don-vi.component';
const routes: Routes = [
  {
    path: '',
    component: DsKhoachPboGiaoDtoanChoDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsKhoachPboGiaoDtoanChoDonViRoutingModule {}
