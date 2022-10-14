import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VonPhiHangCuaBoNganhComponent } from './von-phi-hang-cua-bo-nganh.component';

const routes: Routes = [
  {
    path: '',
    component: VonPhiHangCuaBoNganhComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VonPhiHangCuaBoNganhRoutingModule{ }
