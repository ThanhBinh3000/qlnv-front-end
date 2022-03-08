import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyLapThamDinhDuToanNSNNComponent } from './quan-ly-lap-tham-dinh-du-toan-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyLapThamDinhDuToanNSNNComponent,
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
    path: 'xay-dung-ke-hoach-von-dau-tu',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-von-dau-tu/xay-dung-ke-hoach-von-dau-tu.module'
      ).then((m) => m.XayDungKeHoachVonDauTuModule),
  },
  {
    path: 'xay-dung-ke-hoach-von-dau-tu/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-von-dau-tu/xay-dung-ke-hoach-von-dau-tu.module'
      ).then((m) => m.XayDungKeHoachVonDauTuModule),
  },
  {
    path: 'xay-dung-nhu-cau-nhap-xuat-hang-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-nhu-cau-nhap-xuat-hang-nam/xay-dung-nhu-cau-nhap-xuat-hang-nam.module'
      ).then((m) => m.XayDungNhuCauNhapXuatHangNamModule),
  },
  {
    path: 'xay-dung-nhu-cau-nhap-xuat-hang-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-nhu-cau-nhap-xuat-hang-nam/xay-dung-nhu-cau-nhap-xuat-hang-nam.module'
      ).then((m) => m.XayDungNhuCauNhapXuatHangNamModule),
  },
  {
    path: 'ke-hoach-bao-quan-hang-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-bao-quan-hang-nam/ke-hoach-bao-quan-hang-nam.module'
      ).then((m) => m.KeHoachBaoQuanHangNamModule),
  },
  {
    path: 'ke-hoach-bao-quan-hang-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-bao-quan-hang-nam/ke-hoach-bao-quan-hang-nam.module'
      ).then((m) => m.KeHoachBaoQuanHangNamModule),
  },
  {
    path: 'nhu-cau-xuat-hang-vien-tro',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-xuat-hang-vien-tro/nhu-cau-xuat-hang-vien-tro.module'
      ).then((m) => m.NhuCauXuatHangVienTroModule),
  },
  {
    path: 'nhu-cau-xuat-hang-vien-tro/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-xuat-hang-vien-tro/nhu-cau-xuat-hang-vien-tro.module'
      ).then((m) => m.NhuCauXuatHangVienTroModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong3-nam/xay-dung-ke-hoach-quy-tien-luong3-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuong3NamModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong3-nam/xay-dung-ke-hoach-quy-tien-luong3-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuong3NamModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong-hang-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong-hang-nam/xay-dung-ke-hoach-quy-tien-luong-hang-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuongHangNamModule),
  },
  {
    path: 'xay-dung-ke-hoach-quy-tien-luong-hang-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/xay-dung-ke-hoach-quy-tien-luong-hang-nam/xay-dung-ke-hoach-quy-tien-luong-hang-nam.module'
      ).then((m) => m.XayDungKeHoachQuyTienLuongHangNamModule),
  },
  {
    path: 'thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh.module'
      ).then((m) => m.ThuyetMinhChiDeTaiDuAnNghienCuuKhModule),
  },
  {
    path: 'thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh.module'
      ).then((m) => m.ThuyetMinhChiDeTaiDuAnNghienCuuKhModule),
  },
  {
    path: 'nhu-cau-ke-hoach-dtxd3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-tong-cuc/nhu-cau-ke-hoach-dtxd3-nam/nhu-cau-ke-hoach-dtxd3-nam.module'
      ).then((m) => m.NhuCauKeHoachDtxd3NamModule),
  },
  {
    path: 'nhu-cau-ke-hoach-dtxd3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-tong-cuc/nhu-cau-ke-hoach-dtxd3-nam/nhu-cau-ke-hoach-dtxd3-nam.module'
      ).then((m) => m.NhuCauKeHoachDtxd3NamModule),
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyLapThamDinhDuToanNSNNRoutingModule {}
