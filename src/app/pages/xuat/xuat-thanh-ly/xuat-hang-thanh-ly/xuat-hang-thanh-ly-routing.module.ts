import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XuatHangThanhLyComponent } from './xuat-hang-thanh-ly.component';


const routes: Routes = [
  {
    path: '',
    component: XuatHangThanhLyComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'giao-nv-xh',
      //   pathMatch: 'full',
      // },
      // //Region quyết định giao nv xuất hàng
      // {
      //   path: 'giao-nv-xh',
      //   component: QuyetDinhXhComponent
      // },
      // {
      //   path: 'giao-nv-xh/them-moi',
      //   component: ThemMoiQdxhComponent
      // },
      // {
      //   path: 'giao-nv-xh/chi-tiet/:id',
      //   component: ThemMoiQdxhComponent
      // },
      // // Region Phiếu xuất kho
      // {
      //   path: 'phieu-xuat-kho',
      //   component: PhieuXuatKhoComponent
      // },
      // {
      //   path: 'phieu-xuat-kho/them-moi',
      //   component: ThemMoiPxkComponent
      // },
      // {
      //   path: 'phieu-xuat-kho/chi-tiet/:id',
      //   component: ThemMoiPxkComponent
      // },
      // // Region Bảng kê
      // {
      //   path: 'bang-ke',
      //   component: BangKeComponent
      // },
      // {
      //   path: 'bang-ke/them-moi',
      //   component: ThemMoiBkComponent
      // },
      // {
      //   path: 'bang-ke/chi-tiet/:id',
      //   component: ThemMoiBkComponent
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatHangThanhLyRoutingModule { }
