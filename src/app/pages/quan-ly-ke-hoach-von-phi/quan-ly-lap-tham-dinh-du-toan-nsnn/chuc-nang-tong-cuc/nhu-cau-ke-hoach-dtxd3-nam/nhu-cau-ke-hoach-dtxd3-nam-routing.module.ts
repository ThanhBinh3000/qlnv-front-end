import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhuCauKeHoachDtxd3NamComponent } from './nhu-cau-ke-hoach-dtxd3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: NhuCauKeHoachDtxd3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhuCauKeHoachDtxd3NamRoutingModule {}
