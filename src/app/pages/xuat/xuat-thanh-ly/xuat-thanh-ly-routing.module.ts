import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XuatThanhLyComponent } from "./xuat-thanh-ly.component";
import { ThanhLyDanhSachHangComponent } from './thanh-ly-danh-sach-hang/thanh-ly-danh-sach-hang.component';
import { TongHopThanhLyComponent } from './tong-hop-thanh-ly/tong-hop-thanh-ly.component';
import { HoSoThanhLyComponent } from './ho-so-thanh-ly/ho-so-thanh-ly.component';
import { QuyetDinhThanhLyComponent } from './quyet-dinh-thanh-ly/quyet-dinh-thanh-ly.component';
import { ThongBaoKetQuaComponent } from './thong-bao-ket-qua/thong-bao-ket-qua.component';
import { ChiTietHoSoThanhLyComponent } from './ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly.component';


const routes: Routes = [
  {
    path: '',
    component: XuatThanhLyComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach',
        pathMatch: 'full',
      },
      //Region quyết định giao nv xuất hàng
      {
        path: 'danh-sach',
        component: ThanhLyDanhSachHangComponent
      },
      {
        path: 'tong-hop',
        component: TongHopThanhLyComponent
      },
      // Region Trình Thẩm Định
      {
        path: 'trinh-tham-dinh',
        component: HoSoThanhLyComponent
      },
      {
        path: 'trinh-tham-dinh/them-moi',
        component: ChiTietHoSoThanhLyComponent
      },
      {
        path: 'trinh-tham-dinh/chi-tiet/:id',
        component: ChiTietHoSoThanhLyComponent
      },
      // Region Quyết định
      {
        path: 'quyet-dinh',
        component: QuyetDinhThanhLyComponent
      },
      {
        path: 'quyet-dinh/them-moi',
        component: QuyetDinhThanhLyComponent
      },
      {
        path: 'quyet-dinh/chi-tiet/:id',
        component: QuyetDinhThanhLyComponent
      },
      // Region Thông báo kq
      {
        path: 'thong-bao-kq',
        component: ThongBaoKetQuaComponent
      },
      {
        path: 'thong-bao-kq/them-moi',
        component: ThongBaoKetQuaComponent
      },
      {
        path: 'thong-bao-kq/chi-tiet/:id',
        component: ThongBaoKetQuaComponent
      },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatThanhLyRoutingModule { }
