import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {XuatKhoComponent} from "./xuat-kho.component";
import {XtlPhieuXkComponent} from "./xtl-phieu-xk/xtl-phieu-xk.component";
import {XtlBangKeChComponent} from "./xtl-bang-ke-ch/xtl-bang-ke-ch.component";
import {XtlBbTinhKhoComponent} from "./xtl-bb-tinh-kho/xtl-bb-tinh-kho.component";
import {XtlBbHaoDoiComponent} from "./xtl-bb-hao-doi/xtl-bb-hao-doi.component";
import {XtlThemBbHaoDoiComponent} from "./xtl-bb-hao-doi/xtl-them-bb-hao-doi/xtl-them-bb-hao-doi.component";
import {XtlThemBbTinhKhoComponent} from "./xtl-bb-tinh-kho/xtl-them-bb-tinh-kho/xtl-them-bb-tinh-kho.component";
import {XtlThemBangKeChComponent} from "./xtl-bang-ke-ch/xtl-them-bang-ke-ch/xtl-them-bang-ke-ch.component";
import {XtlThemPhieuXkComponent} from "./xtl-phieu-xk/xtl-them-phieu-xk/xtl-them-phieu-xk.component";

const routes: Routes = [
  {
    path: '',
    component: XuatKhoComponent,
    children: [
      {
        path: '',
        redirectTo: 'xtl-phieu-xk',
        pathMatch: 'full',
      },
      //Region phiếu xuất kho
      {
        path: 'xtl-phieu-xk',
        component: XtlPhieuXkComponent
      },
      {
        path: 'xtl-phieu-xk/them-moi',
        component: XtlThemPhieuXkComponent
      },
      {
        path: 'xtl-phieu-xk/chi-tiet/:id',
        component: XtlThemPhieuXkComponent
      },
      //Region bảng kê cân hàng
      {
        path: 'xtl-bang-ke-ch',
        component: XtlBangKeChComponent
      },
      {
        path: 'xtl-bang-ke-ch/them-moi',
        component: XtlThemBangKeChComponent
      },
      {
        path: 'xtl-bang-ke-ch/chi-tiet/:id',
        component: XtlThemBangKeChComponent
      },
      //Region biên bản tịnh kho
      {
        path: 'xtl-bb-tinh-kho',
        component: XtlBbTinhKhoComponent
      },
      {
        path: 'xtl-bb-tinh-kho/them-moi',
        component: XtlThemBbTinhKhoComponent
      },
      {
        path: 'xtl-bb-tinh-kho/chi-tiet/:id',
        component: XtlThemBbTinhKhoComponent
      },
      //Region biên bản hao dôi
      {
        path: 'xtl-bb-hao-doi',
        component: XtlBbHaoDoiComponent
      },
      {
        path: 'xtl-bb-hao-doi/them-moi',
        component: XtlThemBbHaoDoiComponent
      },
      {
        path: 'xtl-bb-hao-doi/chi-tiet/:id',
        component: XtlThemBbHaoDoiComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatKhoRoutingModule { }
