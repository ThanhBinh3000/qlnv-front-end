import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyGiaoDuToanChiNSNNComponent } from './quan-ly-giao-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyGiaoDuToanChiNSNNComponent,
  },
  {
    path: 'tim-kiem',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  {
    path: 'tong-hop',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  {
    path: 'chi-thuong-xuyen-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-thuong-xuyen-3-nam/chi-thuong-xuyen-3-nam.module'
      ).then((m) => m.ChiThuongXuyen3NamModule),
  },
  {
    path: 'chi-thuong-xuyen-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-thuong-xuyen-3-nam/chi-thuong-xuyen-3-nam.module'
      ).then((m) => m.ChiThuongXuyen3NamModule),
  },
  {
    path: 'nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNsnnBtcPdModule),
  },
  {
    path: 'nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNsnnBtcPdModule),
  },
  {
    path: 'danh-sach-ke-hoach-phan-bo-ngan-sach',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/danh-sach-ke-hoach-phan-bo-ngan-sach/danh-sach-ke-hoach-phan-bo-ngan-sach.module'
      ).then((m) => m.DanhSachKeHoachPhanBoNganSachModule),
  },
  {
    path: 'danh-sach-ke-hoach-phan-bo-ngan-sach/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/danh-sach-ke-hoach-phan-bo-ngan-sach/danh-sach-ke-hoach-phan-bo-ngan-sach.module'
      ).then((m) => m.DanhSachKeHoachPhanBoNganSachModule),
  },
  {
    path: 'lap-du-toan-chi-ngan-sach-cho-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/lap-du-toan-chi-ngan-sach-cho-don-vi/lap-du-toan-chi-ngan-sach-cho-don-vi.module'
      ).then((m) => m.LapDuToanChiNganSachChoDonViModule),
  },
  {
    path: 'lap-du-toan-chi-ngan-sach-cho-don-vi/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/lap-du-toan-chi-ngan-sach-cho-don-vi/lap-du-toan-chi-ngan-sach-cho-don-vi.module'
      ).then((m) => m.LapDuToanChiNganSachChoDonViModule),
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyGiaoDuToanChiNSNNRoutingModule {}
