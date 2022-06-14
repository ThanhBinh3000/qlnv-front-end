import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiaoNhiemVuComponent } from './giao-nhiem-vu.component';

const routes: Routes = [
  {
    path: '',
    component: GiaoNhiemVuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiaoNhiemVuRoutingModule { }
