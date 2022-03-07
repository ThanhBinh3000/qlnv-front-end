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
    path: 'ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam.module'
      ).then((m) => m.KeHoachXayDungVanBanQpplDtqg3NamModule),
  },
  {
    path: 'ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam.module'
      ).then((m) => m.KeHoachXayDungVanBanQpplDtqg3NamModule),
  },
  {
    path: 'du-toan-chi-ung-dung-cntt-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/du-toan-chi-ung-dung-cntt-3-nam/du-toan-chi-ung-dung-cntt-3-nam.module'
      ).then((m) => m.DuToanChiUngDungCntt3NamModule),
  },
  {
    path: 'du-toan-chi-ung-dung-cntt-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/du-toan-chi-ung-dung-cntt-3-nam/du-toan-chi-ung-dung-cntt-3-nam.module'
      ).then((m) => m.DuToanChiUngDungCntt3NamModule),
  },
  {
    path: 'chi-mua-sam-thiet-bi-chuyen-dung-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/chi-mua-sam-thiet-bi-chuyen-dung-3-nam.module'
      ).then((m) => m.ChiMuaSamThietBiChuyenDung3NamModule),
  },
  {
    path: 'chi-mua-sam-thiet-bi-chuyen-dung-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/chi-mua-sam-thiet-bi-chuyen-dung-3-nam.module'
      ).then((m) => m.ChiMuaSamThietBiChuyenDung3NamModule),
  },
  {
    path: 'chi-ngan-sach-nha-nuoc-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-ngan-sach-nha-nuoc-3-nam/chi-ngan-sach-nha-nuoc-3-nam.module'
      ).then((m) => m.ChiNganSachNhaNuoc3NamModule),
  },
  {
    path: 'chi-ngan-sach-nha-nuoc-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-ngan-sach-nha-nuoc-3-nam/chi-ngan-sach-nha-nuoc-3-nam.module'
      ).then((m) => m.ChiNganSachNhaNuoc3NamModule),
  },
  {
    path: 'nhu-cau-phi-nhap-xuat-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-phi-nhap-xuat-3-nam/nhu-cau-phi-nhap-xuat-3-nam.module'
      ).then((m) => m.NhuCauPhiNhapXuat3NamModule),
  },
  {
    path: 'nhu-cau-phi-nhap-xuat-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-phi-nhap-xuat-3-nam/nhu-cau-phi-nhap-xuat-3-nam.module'
      ).then((m) => m.NhuCauPhiNhapXuat3NamModule),
  },
  {
    path: 'ke-hoach-cai-tao-va-sua-chua-lon-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/ke-hoach-cai-tao-va-sua-chua-lon-3-nam.module'
      ).then((m) => m.KeHoachCaiTaoVaSuaChuaLon3NamModule),
  },
  {
    path: 'ke-hoach-cai-tao-va-sua-chua-lon-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/ke-hoach-cai-tao-va-sua-chua-lon-3-nam.module'
      ).then((m) => m.KeHoachCaiTaoVaSuaChuaLon3NamModule),
  },
  {
    path: 'ke-hoach-dao-tao-boi-duong-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module'
      ).then((m) => m.KeHoachDaoTaoBoiDuong3NamModule),
  },
  {
    path: 'ke-hoach-dao-tao-boi-duong-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module'
      ).then((m) => m.KeHoachDaoTaoBoiDuong3NamModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyLapThamDinhDuToanNSNNRoutingModule {}
