import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {XuatTieuHuyComponent} from "./xuat-tieu-huy.component";
import {ThongBaoKetQuaComponent} from "./thong-bao-ket-qua/thong-bao-ket-qua.component";
import {BaoCaoKetQuaThanhLyComponent} from "../xuat-thanh-ly/bao-cao-ket-qua/bao-cao-ket-qua-thanh-ly.component";
import {
  ThemMoiBaoCaoKetQuaThanhLyComponent
} from "../xuat-thanh-ly/bao-cao-ket-qua/them-moi-bao-ket-qua-thanh-ly/them-moi-bao-cao-ket-qua-thanh-ly.component";
import {DanhSachHangTieuHuyComponent} from "./danh-sach-hang-tieu-huy/danh-sach-hang-tieu-huy.component";
import {TongHopTieuHuyComponent} from "./tong-hop-tieu-huy/tong-hop-tieu-huy.component";
import {HoSoTieuHuyComponent} from "./ho-so-tieu-huy/ho-so-tieu-huy.component";
import {ChiTietHoSoTieuHuyComponent} from "./ho-so-tieu-huy/chi-tiet-ho-so-tieu-huy/chi-tiet-ho-so-tieu-huy.component";
import {QuyetDinhTieuHuyComponent} from "./quyet-dinh-tieu-huy/quyet-dinh-tieu-huy.component";
import {
  ThemMoiQuyetDinhTieuHuyComponent
} from "./quyet-dinh-tieu-huy/them-moi-quyet-dinh-tieu-huy/them-moi-quyet-dinh-tieu-huy.component";
import {
  ThemMoiThongBaoKetQuaComponent
} from "./thong-bao-ket-qua/them-moi-thong-bao-ket-qua/them-moi-thong-bao-ket-qua.component";
import {BaoCaoKetQuaTieuHuyComponent} from "./bao-cao-ket-qua-tieu-huy/bao-cao-ket-qua-tieu-huy.component";
import {
  ThemMoiBaoCaoKetQuaTieuHuyComponent
} from "./bao-cao-ket-qua-tieu-huy/them-moi-bao-ket-qua-tieu-huy/them-moi-bao-cao-ket-qua-tieu-huy.component";

const routes: Routes = [
  {
    path: '',
    component: XuatTieuHuyComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach',
        pathMatch: 'full',
      },
      //Region quyết định giao nv xuất hàng
      {
        path: 'danh-sach',
        component: DanhSachHangTieuHuyComponent
      },
      {
        path: 'tong-hop',
        component: TongHopTieuHuyComponent
      },
      {
        path: 'tong-hop/chi-tiet/:id',
        component: TongHopTieuHuyComponent
      },
      // Region Trình Thẩm Định
      {
        path: 'trinh-tham-dinh',
        component: HoSoTieuHuyComponent
      },
      {
        path: 'trinh-tham-dinh/them-moi',
        component: ChiTietHoSoTieuHuyComponent
      },
      {
        path: 'trinh-tham-dinh/chi-tiet/:id',
        component: ChiTietHoSoTieuHuyComponent
      },
      // Region Quyết định
      {
        path: 'quyet-dinh',
        component: QuyetDinhTieuHuyComponent
      },
      {
        path: 'quyet-dinh/them-moi',
        component: ThemMoiQuyetDinhTieuHuyComponent
      },
      {
        path: 'quyet-dinh/chi-tiet/:id',
        component: ThemMoiQuyetDinhTieuHuyComponent
      },
      // Region Thông báo kq
      {
        path: 'thong-bao-kq',
        component: ThongBaoKetQuaComponent
      },
      {
        path: 'thong-bao-kq/them-moi',
        component: ThemMoiThongBaoKetQuaComponent
      },
      {
        path: 'thong-bao-kq/chi-tiet/:id',
        component: ThemMoiThongBaoKetQuaComponent
      },

      // Region Thông báo kq
      {
        path: 'bao-cao-kq',
        component: BaoCaoKetQuaTieuHuyComponent
      },
      {
        path: 'bao-cao-kq/them-moi',
        component: ThemMoiBaoCaoKetQuaTieuHuyComponent
      },
      {
        path: 'bao-cao-kq/chi-tiet/:id',
        component: ThemMoiBaoCaoKetQuaTieuHuyComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XuatTieuHuyRoutingModule { }
