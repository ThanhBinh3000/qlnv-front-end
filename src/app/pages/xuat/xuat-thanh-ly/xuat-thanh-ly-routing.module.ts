import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {XuatThanhLyComponent} from "./xuat-thanh-ly.component";


const routes: Routes = [
  {
    path: '',
    component: XuatThanhLyComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatThanhLyRoutingModule { }
