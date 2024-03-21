import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KhknBaoQuanComponent} from "../khkn-bao-quan/khkn-bao-quan.component";
import {AuthGuard} from "../../guard/auth.guard";
import {
  QuanLyCongTrinhNghienCuuBaoQuanComponent
} from "../khkn-bao-quan/quan-ly-cong-trinh-nghien-cuu-bao-quan/quan-ly-cong-trinh-nghien-cuu-bao-quan.component";
import {
  QuanLyQuyChuanKyThuatQuocGiaComponent
} from "../khkn-bao-quan/quan-ly-quy-chuan-ky-thuat-quoc-gia/quan-ly-quy-chuan-ky-thuat-quoc-gia.component";
import {KhoiTaoDuLieuComponent} from "./khoi-tao-du-lieu.component";
import {HtCongCuDungCuComponent} from "./ht-cong-cu-dung-cu/ht-cong-cu-dung-cu.component";

const routes: Routes = [
  {
    path: '',
    component: KhoiTaoDuLieuComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'ht-cong-cu-dung-cu',
        component: HtCongCuDungCuComponent,
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
