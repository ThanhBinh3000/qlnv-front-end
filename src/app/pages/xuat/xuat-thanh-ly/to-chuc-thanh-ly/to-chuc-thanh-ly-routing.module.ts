import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToChucThanhLyComponent} from './to-chuc-thanh-ly.component';
import {ThongTinDauGiaThanhLyComponent} from "./thong-tin-dau-gia-thanh-ly/thong-tin-dau-gia-thanh-ly.component";
import {
  ChiTietThongTinDauGiaComponent
} from "../../dau-gia/to-chuc-trien-khai/main-tochuc-trienkhai/thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia.component";
import {
  ChiTietThongTinDauGiaThanhLyComponent
} from "./thong-tin-dau-gia-thanh-ly/chi-tiet-thong-tin-dau-gia-thanh-ly/chi-tiet-thong-tin-dau-gia-thanh-ly.component";
import {
  QuyetDinhPheDuyetKqBdgThanhLyComponent
} from "./quyet-dinh-phe-duyet-kq-bdg-thanh-ly/quyet-dinh-phe-duyet-kq-bdg-thanh-ly.component";
import {
  ChiTietQuyetDinhPheDuyetBdgThanhLyComponent
} from "./quyet-dinh-phe-duyet-kq-bdg-thanh-ly/chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly/chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly.component";
import {HopDongThanhLyComponent} from "./hop-dong-thanh-ly/hop-dong-thanh-ly.component";
import {
  ThongTinHopDongThanhLyComponent
} from "./hop-dong-thanh-ly/thong-tin-hop-dong-thanh-ly/thong-tin-hop-dong-thanh-ly.component";
import {
  QuyetDinhGiaoNhiemVuThanhLyComponent
} from "./quyet-dinh-giao-nhiem-vu-thanh-ly/quyet-dinh-giao-nhiem-vu-thanh-ly.component";
import {
  ChiTietQuyetDinhGiaoNhiemVuThanhLyComponent
} from "./quyet-dinh-giao-nhiem-vu-thanh-ly/chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly/chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly.component";
import {
  QuanLyHopDongThanhLyComponent
} from "./hop-dong-thanh-ly/quan-ly-hop-dong-thanh-ly/quan-ly-hop-dong-thanh-ly.component";


const routes: Routes = [
  {
    path: '',
    component: ToChucThanhLyComponent,
    children: [
      {
        path: '',
        redirectTo: 'thong-tin-dau-gia',
        pathMatch: 'full',
      },
      // Region Thông tin đấu giá
      {
        path: 'thong-tin-dau-gia',
        component: ThongTinDauGiaThanhLyComponent
      },
      {
        path: 'thong-tin-dau-gia/them-moi',
        component: ChiTietThongTinDauGiaThanhLyComponent
      },
      {
        path: 'thong-tin-dau-gia/chi-tiet/:id',
        component: ChiTietThongTinDauGiaThanhLyComponent
      },
      // Region phiếu nhập kho
      {
        path: 'qd-pd-kq',
        component: QuyetDinhPheDuyetKqBdgThanhLyComponent
      },
      {
        path: 'qd-pd-kq/them-moi',
        component: ChiTietQuyetDinhPheDuyetBdgThanhLyComponent
      },
      {
        path: 'qd-pd-kq/chi-tiet/:id',
        component: ChiTietQuyetDinhPheDuyetBdgThanhLyComponent
      },
      // Region bảng kê nhập vật tư
      {
        path: 'hop-dong',
        component: HopDongThanhLyComponent
      },
      {
        path: 'hop-dong/them-moi',
        component: ThongTinHopDongThanhLyComponent
      },
      {
        path: 'hop-dong/quan-ly-chi-tiet/:id',
        component: QuanLyHopDongThanhLyComponent
      },
      {
        path: 'hop-dong/chi-tiet/:id',
        component: ThongTinHopDongThanhLyComponent
      },
      // Region biên bản giao nhận/kết thúc nhâp kho
      {
        path: 'qd-giao-nv-xh',
        component: QuyetDinhGiaoNhiemVuThanhLyComponent
      },
      {
        path: 'qd-giao-nv-xh/them-moi',
        component: ChiTietQuyetDinhGiaoNhiemVuThanhLyComponent
      },
      {
        path: 'qd-giao-nv-xh/chi-tiet/:id',
        component: ChiTietQuyetDinhGiaoNhiemVuThanhLyComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToChucThanhLyRoutingModule { }
