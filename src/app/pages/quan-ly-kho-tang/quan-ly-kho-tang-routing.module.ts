import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KeHoachComponent} from './ke-hoach/ke-hoach.component';
import {MangLuoiKhoComponent} from './mang-luoi-kho/mang-luoi-kho.component';
import {QuanLyKhoTangComponent} from './quan-ly-kho-tang.component';
import {TienDoXayDungSuaChuaComponent} from "./tien-do-xay-dung-sua-chua/tien-do-xay-dung-sua-chua.component";
import {
  QuyetDinhDieuChuyenSapNhapKhoComponent
} from "./sap-nhap-kho/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-sap-nhap-kho.component";
import {SapNhapKhoComponent} from "./sap-nhap-kho/sap-nhap-kho.component";

const routes: Routes = [
  {
    path: '',
    component: QuanLyKhoTangComponent,
    children: [
      {
        path: '',
        redirectTo: 'mang-luoi-kho',
        pathMatch: 'full',
      },
      {
        path: 'mang-luoi-kho',
        component: MangLuoiKhoComponent,
      },
      {
        path: 'ke-hoach',
        component: KeHoachComponent,
      },
      {
        path: 'tien-do-xay-dung-sua-chua',
        component: TienDoXayDungSuaChuaComponent,
      },
      {
        path: 'sap-nhap-kho',
        component: SapNhapKhoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyKhoTangRoutingModule {
}
