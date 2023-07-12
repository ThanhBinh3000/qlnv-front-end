import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachDieuChuyenComponent } from "./ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.component";
import { DieuChuyenNoiBoComponent } from "./dieu-chuyen-noi-bo.component";
import { TongHopDieuChuyenTaiCuc } from './tong-hop-dieu-chuyen-tai-cuc/tong-hop-dieu-chuyen-tai-cuc.component';
import {
  TongHopDieuChuyenTaiTongCuc
} from './tong-hop-dieu-chuyen-tai-tong-cuc/tong-hop-dieu-chuyen-tai-tong-cuc.component';
import { BaoCaoComponent } from './bao-cao-dieu-chuyen/bao-cao/bao-cao.component';
import { BaoCaoDieuChuyenComponent } from './bao-cao-dieu-chuyen/bao-cao-dieu-chuyen.component';

const routes: Routes = [
  {
    path: '',
    component: DieuChuyenNoiBoComponent,
    children: [
      {
        path: '',
        redirectTo: 'ke-hoach-dieu-chuyen',
        pathMatch: 'full',
      },
      {
        path: 'ke-hoach-dieu-chuyen',
        component: KeHoachDieuChuyenComponent,
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
      {
        path: 'bao-cao',
        component: BaoCaoDieuChuyenComponent
      },
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DieuChuyenNoiBoRoutingModule {
}
