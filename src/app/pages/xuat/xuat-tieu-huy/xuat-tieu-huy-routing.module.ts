import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {XuatTieuHuyComponent} from "./xuat-tieu-huy.component";

const routes: Routes = [
  {
    path: '',
    component: XuatTieuHuyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatTieuHuyRoutingModule { }
