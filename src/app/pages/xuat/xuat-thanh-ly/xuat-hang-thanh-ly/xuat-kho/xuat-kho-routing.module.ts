import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {XuatHangThanhLyComponent} from "../xuat-hang-thanh-ly.component";
import {XuatKhoComponent} from "./xuat-kho.component";

const routes: Routes = [
  {
    path: '',
    component: XuatKhoComponent,
    children: [
      {
        path: '',
        redirectTo: 'kiem-tra-lt',
        pathMatch: 'full',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatKhoRoutingModule { }
