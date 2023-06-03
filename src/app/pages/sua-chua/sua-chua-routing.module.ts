import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DieuChuyenNoiBoComponent} from "src/app/pages/dieu-chuyen-noi-bo/dieu-chuyen-noi-bo.component";
import {
  KeHoachDieuChuyenComponent
} from "src/app/pages/dieu-chuyen-noi-bo/ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.component";
import {
  TongHopDieuChuyenTaiCuc
} from "src/app/pages/dieu-chuyen-noi-bo/tong-hop-dieu-chuyen-tai-cuc/tong-hop-dieu-chuyen-tai-cuc.component";
import {
  TongHopDieuChuyenTaiTongCuc
} from "src/app/pages/dieu-chuyen-noi-bo/tong-hop-dieu-chuyen-tai-tong-cuc/tong-hop-dieu-chuyen-tai-tong-cuc.component";
import {SuaChuaComponent} from "src/app/pages/sua-chua/sua-chua.component";
import {DanhSachSuaChuaComponent} from "src/app/pages/sua-chua/danh-sach-sua-chua/danh-sach-sua-chua.component";

const routes: Routes = [
  {
    path: '',
    component: SuaChuaComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach-sua-chua',
        pathMatch: 'full',
      },
      {
        path: 'danh-sach-sua-chua',
        component: DanhSachSuaChuaComponent,
      },
      {
        path: 'tong-hop-dieu-chuyen-tai-cuc',
        component: TongHopDieuChuyenTaiCuc
      },
      {
        path: 'tong-hop-dieu-chuyen-tong-cuc',
        component: TongHopDieuChuyenTaiTongCuc
      },
      {
        path: 'quyet-dinh-dieu-chuyen',
        loadChildren: () =>
          import(
            '../dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen.module'
            ).then((m) => m.QuyetDinhDieuChuyenModule),
      },
      {
        path: 'xuat-dieu-chuyen',
        loadChildren: () =>
          import(
            '../dieu-chuyen-noi-bo/xuat-dieu-chuyen/xuat-dieu-chuyen.module'
            ).then((m) => m.XuatDieuChuyenModule),
      },
      {
        path: 'nhap-dieu-chuyen',
        loadChildren: () =>
          import(
            '../dieu-chuyen-noi-bo/nhap-dieu-chuyen/nhap-dieu-chuyen.module'
            ).then((m) => m.NhapDieuChuyenModule),
      },
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuaChuaRoutingModule { }
