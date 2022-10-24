import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiaoKeHoachVaDuToanComponent } from './giao-ke-hoach-va-du-toan.component';

const routes: Routes = [
  {
    path: '',
    component: GiaoKeHoachVaDuToanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiaoKeHoachVaDuToanRoutingModule { }
