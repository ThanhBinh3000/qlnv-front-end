import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiemTraComponent} from "./kiem-tra.component";
import {ThanhLyDanhSachHangComponent} from "../../thanh-ly-danh-sach-hang/thanh-ly-danh-sach-hang.component";
import {XtlBbLmComponent} from "./xtl-bb-lm/xtl-bb-lm.component";
import {XtlHsKtComponent} from "./xtl-hs-kt/xtl-hs-kt.component";
import {XtlPhieuKtraClComponent} from "./xtl-phieu-ktra-cl/xtl-phieu-ktra-cl.component";
import {
  ChiTietHoSoThanhLyComponent
} from "../../ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly.component";
import {XtlThemPhieuKtraClComponent} from "./xtl-phieu-ktra-cl/xtl-them-phieu-ktra-cl/xtl-them-phieu-ktra-cl.component";
import {XtlThemBbLmComponent} from "./xtl-bb-lm/xtl-them-bb-lm/xtl-them-bb-lm.component";
import {XtlThemHsKtComponent} from "./xtl-hs-kt/xtl-them-hs-kt/xtl-them-hs-kt.component";

const routes: Routes = [
  {
    path: '',
    component: KiemTraComponent,
    children: [
      {
        path: '',
        redirectTo: 'xtl-bb-lm',
        pathMatch: 'full',
      },
      //Region biên bản lấy mẫu
      {
        path: 'xtl-bb-lm',
        component: XtlBbLmComponent
      },
      {
        path: 'xtl-bb-lm/them-moi',
        component: XtlThemBbLmComponent
      },
      {
        path: 'xtl-bb-lm/chi-tiet/:id',
        component: XtlThemBbLmComponent
      },
      // Region phiếu kiểm tra chất lượng
      {
        path: 'xtl-phieu-ktra-cl',
        component: XtlPhieuKtraClComponent
      },
      {
        path: 'xtl-phieu-ktra-cl/them-moi',
        component: XtlThemPhieuKtraClComponent
      },
      {
        path: 'xtl-phieu-ktra-cl/chi-tiet/:id',
        component: XtlThemPhieuKtraClComponent
      },
      // Region hồ sơ kỹ thuật
      {
        path: 'xtl-hs-kt',
        component: XtlHsKtComponent
      },
      {
        path: 'xtl-hs-kt/them-moi',
        component: XtlThemHsKtComponent
      },
      {
        path: 'xtl-hs-kt/chi-tiet/:id',
        component: XtlThemHsKtComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KiemTraRoutingModule { }
