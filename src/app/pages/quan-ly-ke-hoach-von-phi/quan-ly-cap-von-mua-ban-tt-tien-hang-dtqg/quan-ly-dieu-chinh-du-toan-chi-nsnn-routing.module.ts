import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyDieuChinhDuToanChiNSNNComponent } from './quan-ly-dieu-chinh-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyDieuChinhDuToanChiNSNNComponent,
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
    path: 'danh-sach-cap-von-btc',
    loadChildren: () =>
      import(
        './ghi-nhan-thong-tin-nhan-tien-von-tu-btc/danh-sach-cap-von/danh-sach-cap-von.module'
      ).then((m) => m.DanhSachCapVonModule),
  },
  {
    path: 'ghi-nhan-thong-tin-tien-nhan-von-cap-von-ung',
    loadChildren: () =>
      import(
        './ghi-nhan-thong-tin-nhan-tien-von-tu-btc/ghi-nhan-thong-tin-tien-nhan-von-cap-von-ung/ghi-nhan-thong-tin-tien-nhan-von-cap-von-ung.module'
      ).then((m) => m.GhiNhanThongTinTienNhanVonCapVonUngModule),
  },
  {
    path: 'ghi-nhan-thong-tin-tien-nhan-von-cap-von-ung/:id',
    loadChildren: () =>
      import(
        './ghi-nhan-thong-tin-nhan-tien-von-tu-btc/ghi-nhan-thong-tin-tien-nhan-von-cap-von-ung/ghi-nhan-thong-tin-tien-nhan-von-cap-von-ung.module'
      ).then((m) => m.GhiNhanThongTinTienNhanVonCapVonUngModule),
  },
  {
    path: 'danh-sach-ghi-nhan-von-ban-hang',
    loadChildren: () =>
      import(
        './ghi-nhan-tt-nhan-tien-von-ban-hang-tu-cuc-dtnn-kv/danh-sach-ghi-nhan-von-ban-hang/danh-sach-ghi-nhan-von-ban-hang.module'
      ).then((m) => m.DanhSachGhiNhanVonBanHangModule),
  },
  {
    path: 'ghi-nhan-von-ban-hang',
    loadChildren: () =>
      import(
        './ghi-nhan-tt-nhan-tien-von-ban-hang-tu-cuc-dtnn-kv/ghi-nhan-von-ban-hang/ghi-nhan-von-ban-hang.module'
      ).then((m) => m.GhiNhanVonBanHangModule),
  },
  {
    path: 'ghi-nhan-von-ban-hang/:id',
    loadChildren: () =>
      import(
        './ghi-nhan-tt-nhan-tien-von-ban-hang-tu-cuc-dtnn-kv/ghi-nhan-von-ban-hang/ghi-nhan-von-ban-hang.module'
      ).then((m) => m.GhiNhanVonBanHangModule),
  },
  {
    path: 'danh-sach-ghi-nhan-von-ban',
    loadChildren: () =>
      import(
        './nhap-tt-tien-von-ban-hang-len-btc/danh-sach-ghi-nhan-von-ban/danh-sach-ghi-nhan-von-ban.module'
      ).then((m) => m.DanhSachGhiNhanVonBanModule),
  },
  {
    path: 'ghi-nhan-tt-nop-tien-von-ban-hang',
    loadChildren: () =>
      import(
        './nhap-tt-tien-von-ban-hang-len-btc/ghi-nhan-tt-nop-tien-von-ban-hang/ghi-nhan-tt-nop-tien-von-ban-hang.module'
      ).then((m) => m.GhiNhanTtNopTienVonBanHangModule),
  },
  {
    path: 'ghi-nhan-tt-nop-tien-von-ban-hang/:id',
    loadChildren: () =>
      import(
        './nhap-tt-tien-von-ban-hang-len-btc/ghi-nhan-tt-nop-tien-von-ban-hang/ghi-nhan-tt-nop-tien-von-ban-hang.module'
      ).then((m) => m.GhiNhanTtNopTienVonBanHangModule),
  },
  {
    path: 'danh-sach-cap-von-cuc-dtnn-kv',
    loadChildren: () =>
      import(
        './nhap-tt-cap-tien-von-mua-von-ung-cho-cuc-dtnn-kv/danh-sach-cap-von/danh-sach-cap-von.module'
      ).then((m) => m.DanhSachCapVonModule),
  },
  {
    path: 'nhap-tt-tien-von-mua-hang-von-ung',
    loadChildren: () =>
      import(
        './nhap-tt-cap-tien-von-mua-von-ung-cho-cuc-dtnn-kv/nhap-tt-tien-von-mua-hang-von-ung/nhap-tt-tien-von-mua-hang-von-ung.module'
      ).then((m) => m.NhapTtTienVonMuaHangVonUngModule),
  },
  {
    path: 'nhap-tt-tien-von-mua-hang-von-ung/:id',
    loadChildren: () =>
      import(
        './nhap-tt-cap-tien-von-mua-von-ung-cho-cuc-dtnn-kv/nhap-tt-tien-von-mua-hang-von-ung/nhap-tt-tien-von-mua-hang-von-ung.module'
      ).then((m) => m.NhapTtTienVonMuaHangVonUngModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyDieuChinhDuToanChiNSNNRoutingModule {}
