import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guard/auth.guard";
import {KhoiTaoDuLieuComponent} from "./khoi-tao-du-lieu.component";
import {MangLuoiKhoComponent} from "../quan-ly-kho-tang/mang-luoi-kho/mang-luoi-kho.component";

const routes: Routes = [
  {
    path: '',
    component: KhoiTaoDuLieuComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'ht-cong-cu-dung-cu',
        component: MangLuoiKhoComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KhoiTaoDuLieuRoutingModule { }
