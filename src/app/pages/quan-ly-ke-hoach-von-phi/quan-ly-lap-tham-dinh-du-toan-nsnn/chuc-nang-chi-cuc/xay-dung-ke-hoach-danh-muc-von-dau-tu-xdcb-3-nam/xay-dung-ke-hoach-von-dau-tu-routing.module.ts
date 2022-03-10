import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XayDungKeHoachVonDauTuComponent } from './xay-dung-ke-hoach-von-dau-tu.component';

const routes: Routes = [
  {
    path: '',
    component: XayDungKeHoachVonDauTuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XayDungKeHoachVonDauTuRoutingModule {}
