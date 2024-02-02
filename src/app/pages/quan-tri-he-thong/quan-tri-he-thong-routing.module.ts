import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiemSoatQuyenTruyCapComponent } from './kiem-soat-quyen-truy-cap/kiem-soat-quyen-truy-cap.component';
import { QuanLyCanBoComponent } from './quan-ly-can-bo/quan-ly-can-bo.component';
import { QuanLyQuyenComponent } from './quan-ly-quyen/quan-ly-quyen.component';
import { QuanTriHeThongNewComponent } from './quan-tri-he-thong.component';
import { QuanTriThamSoComponent } from "./quan-tri-tham-so/quan-tri-tham-so.component";
import { ThongKeTruyCapComponent } from "./thong-ke-truy-cap/thong-ke-truy-cap.component";
import { QuanLyChungThuSoComponent } from './quan-ly-thong-tin/quan-ly-chung-thu-so/quan-ly-chung-thu-so.component';
import { ChotDieuChinhComponent } from './chot-du-lieu/chot-dieu-chinh/chot-dieu-chinh.component';
import { KetChuyenComponent } from './chot-du-lieu/ket-chuyen/ket-chuyen.component';
import { QuanLyThongTinTienIchComponent } from './quan-ly-thong-tin/quan-ly-thong-tin-tien-ich/quan-ly-thong-tin-tien-ich.component';
import { CauHinhDangNhapComponent } from './cau-hinh-dang-nhap/cau-hinh-dang-nhap.component';
import { CauHinhKetNoiKtnbComponent } from './cau-hinh-ket-noi-ktnb/cau-hinh-ket-noi-ktnb.component';

const routes: Routes = [
  {
    path: '',
    component: QuanTriHeThongNewComponent,
    children: [
      {
        path: '',
        redirectTo: 'quan-ly-can-bo',
        pathMatch: 'full',
      },
      {
        path: 'quan-ly-can-bo',
        component: QuanLyCanBoComponent,
      },
      {
        path: 'quan-ly-quyen',
        component: QuanLyQuyenComponent,
      },
      // {
      //   path: 'quan-ly-nhom-quyen',
      //   component: QuanLyNhomQuyenComponent,
      // },
      {
        path: 'kiem-soat-truy-cap',
        component: KiemSoatQuyenTruyCapComponent,
      },
      {
        path: 'quan-tri-tham-so',
        component: QuanTriThamSoComponent,
      },
      {
        path: 'cau-hinh-dang-nhap',
        component: CauHinhDangNhapComponent,
      },
      {
        path: 'cau-hinh-ktnb',
        component: CauHinhKetNoiKtnbComponent,
      },
      {
        path: 'thong-ke-truy-cap',
        component: ThongKeTruyCapComponent,
      },
      {
        path: 'quan-ly-thong-tin',
        component: QuanLyChungThuSoComponent,
      },
      {
        path: 'quan-ly-thong-tin/quan-ly-chung-thu-so',
        component: QuanLyChungThuSoComponent,
      },
      {
        path: 'chot-du-lieu/chot-dieu-chinh',
        component: ChotDieuChinhComponent,
      },
      {
        path: 'chot-du-lieu/chot-nhap-xuat',
        component: ChotDieuChinhComponent,
      },
      {
        path: 'chot-du-lieu/ket-chuyen',
        component: KetChuyenComponent,
      },
      {
        path: 'quan-ly-thong-tin/quan-ly-thong-tin-va-tien-ich',
        component: QuanLyThongTinTienIchComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanTriHeThongNewRoutingModule {
}
