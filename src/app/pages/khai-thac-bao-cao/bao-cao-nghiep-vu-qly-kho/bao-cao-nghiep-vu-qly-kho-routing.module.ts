import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaoCaoNghiepVuQlyKhoComponent} from "./bao-cao-nghiep-vu-qly-kho.component";

const routes: Routes = [
  {
    path: '',
    component: BaoCaoNghiepVuQlyKhoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaoCaoNghiepVuQlyKhoRoutingModule { }
