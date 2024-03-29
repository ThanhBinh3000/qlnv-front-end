import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guard/auth.guard";
import {KhoiTaoDuLieuComponent} from "./khoi-tao-du-lieu.component";
import {MangLuoiKhoComponent} from "../quan-ly-kho-tang/mang-luoi-kho/mang-luoi-kho.component";
import {HtCongCuDungCuComponent} from './ht-cong-cu-dung-cu/ht-cong-cu-dung-cu.component';
import {HtMayMocThietBiComponent} from './ht-may-moc-thiet-bi/ht-may-moc-thiet-bi.component';
import {HopDongComponent} from "./hop-dong/hop-dong.component";
import {CongTacDauGiaComponent} from "./cong-tac-dau-gia/cong-tac-dau-gia.component";
import {CongTacDauThauComponent} from "./cong-tac-dau-thau/cong-tac-dau-thau.component";

const routes: Routes = [
  {
    path: '',
    component: KhoiTaoDuLieuComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'mang-luoi-kho',
        pathMatch: 'full',
      },
      {
        path: 'mang-luoi-kho',
        component: MangLuoiKhoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ht-cong-cu-dung-cu',
        component: HtCongCuDungCuComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ht-may-moc-thiet-bi',
        component: HtMayMocThietBiComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'hop-dong',
        component: HopDongComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'cong-tac-dau-gia',
        component: CongTacDauGiaComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'cong-tac-dau-thau',
        component: CongTacDauThauComponent,
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
