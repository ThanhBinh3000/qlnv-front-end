import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyCapNguonVonChiNSNNComponent } from './quan-ly-cap-nguon-von-chi.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyCapNguonVonChiNSNNComponent,
  },
  {
    path: 'danh-sach-cong-can-de-nghi-cap-von',
    loadChildren: () =>
      import(
        './danh-sach-cong-can-de-nghi-cap-von/danh-sach-cong-can-de-nghi-cap-von.module'
      ).then((m) => m.DanhSachCongVanDeNghiCapVonComponentModule),
  },
  {
    path: 'danh-sach-de-nghi-cap-von',
    loadChildren: () =>
      import(
        './danh-sach-de-nghi-cap-von/danh-sach-de-nghi-cap-von.module'
      ).then((m) => m.DanhSachDeNghiCapVonComponentModule),
  },
  //////////////////////////////////////////////////////////////////////////////////
  {
    path: 'tim-kiem-danh-sach-cong-van-de-nghi-cap-von',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  // {
  //   path:'lap-de-nghi-cap-von-mua-vat-tu-thiet-bi',
  //   loadChildren: () => 
  //   import(
  //     './lap-de-nghi-cap-von-mua-vat-tu-thiet-bi/lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.module'
  //   ).then((m) => m.LapDeNghiCapVonMuaVatTuThietBiModule),
  // },
  {
    path : 'tim-kiem-danh-sach-de-nghi-cap-von',
    loadChildren: () =>
      import(
        './tim-kiem-danh-sach-de-nghi-cap-von/tim-kiem-danh-sach-de-nghi-cap-von.module'
      ).then((m) => m.TimKiemDanhSachDeNghiCapVonModule),
  },
  {
    path:'lap-de-nghi-cap-von-mua-luong-thuc-muoi',
    loadChildren: () =>
      import(
        './lap-de-nghi-cap-von-mua-luong-thuc-muoi/lap-de-nghi-cap-von-mua-luong-thuc-muoi.module'
        ).then((m) => m.LapDeNghiCapVonMuaLuongThucMuoiModule),
  },
  {
    path: 'tim-kiem-danh-sach-tong-hop-de-nghi-cap-von',
    loadChildren: () =>
      import(
        './tim-kiem-danh-sach-tong-hop-de-nghi-cap-von/tim-kiem-danh-sach-tong-hop-de-nghi-cap-von.module'
        ).then((m) => m.TimKiemDanhSachTongHopDeNghiCapVonModule),
  },
  {
    path: 'tong-hop-de-nghi-cap-von',
    loadChildren: () =>
      import(
        './tong-hop-de-nghi-cap-von/tong-hop-de-nghi-cap-von.module'
      ).then((m) => m.TongHopDeNghiCapVonModule),
  },
  {
    path: 'tim-kiem-danh-sach-de-nghi-cap-von-cua-cac-bo-nganh',
    loadChildren:() =>
      import(
        './tim-kiem-danh-sach-de-nghi-cap-von-cua-cac-bo-nganh/tim-kiem-danh-sach-de-nghi-cap-von-bo-nganh.module'
        ).then((m) => m.TimKiemDanhSachDeNghiCapVonBoNganhModule),
  },
  {
    path: 'theo-doi-cap-von-mua-hang-dtqg',
    loadChildren: () =>
      import(
        './theo-doi-cap-von-mua-hang-DTQG/theo-doi-cap-von-mua-hang-dtqg.module'
        ).then((m) => m.TheoDoiCapVonMuaHangDtqgModule),
  },
  {
    path: 'danh-sach-tong-hop-de-nghi-cap-von',
    loadChildren:() =>
      import(
        './danh-sach-tong-hop-de-nghi-cap-von/danh-sach-tong-hop-de-nghi-cap-von.module'
        ).then((m) => m.DanhSachTongHopDeNghiCapVonModule),
  },
  {
    path: 'theo-doi-cap-von-mua-hang-dtqg-2',
    loadChildren: () =>
      import(
        './theo-doi-cap-von-mua-hang-DTQG-2/theo-doi-cap-von-mua-hang-dtqg-2.module'
        ).then((m) => m.TheoDoiCapVonMuaHangDtqg2Module),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyCapNguonVonChiNSNNRoutingModule {}
