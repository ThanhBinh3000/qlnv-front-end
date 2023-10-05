import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {XuatKhacComponent} from "./xuat-khac.component";


const routes: Routes = [
  {
    path: '',
    component: XuatKhacComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatKhacRoutingModule { }
