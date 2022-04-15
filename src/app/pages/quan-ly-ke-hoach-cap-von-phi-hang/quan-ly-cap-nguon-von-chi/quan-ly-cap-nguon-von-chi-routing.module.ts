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
    path:'lap-de-nghi-cap-von-mua-vat-tu-thiet-bi',
    loadChildren: () => 
    import(
      './lap-de-nghi-cap-von-mua-vat-tu-thiet-bi/lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.module'
    ).then((m) => m.LapDeNghiCapVonMuaVatTuThietBiModule),
  },

  {
    path:'lap-de-nghi-cap-von-mua-vat-tu-thiet-bi/:id',
    loadChildren: () => 
    import(
      './lap-de-nghi-cap-von-mua-vat-tu-thiet-bi/lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.module'
    ).then((m) => m.LapDeNghiCapVonMuaVatTuThietBiModule),
  },

  {
    path: 'danh-sach-de-nghi-cap-von',
    loadChildren: () =>
      import(
        './danh-sach-de-nghi-cap-von/danh-sach-de-nghi-cap-von.module'
      ).then((m) => m.DanhSachDeNghiCapVonComponentModule),
  },

  {
    path:'lap-de-nghi-cap-von-mua-luong-thuc-muoi',
    loadChildren: () =>
      import(
        './lap-de-nghi-cap-von-mua-luong-thuc-muoi/lap-de-nghi-cap-von-mua-luong-thuc-muoi.module'
        ).then((m) => m.LapDeNghiCapVonMuaLuongThucMuoiModule),
  },

  {
    path:'lap-de-nghi-cap-von-mua-luong-thuc-muoi/:id',
    loadChildren: () =>
      import(
        './lap-de-nghi-cap-von-mua-luong-thuc-muoi/lap-de-nghi-cap-von-mua-luong-thuc-muoi.module'
        ).then((m) => m.LapDeNghiCapVonMuaLuongThucMuoiModule),
  },

  {
    path: 'danh-sach-tong-hop-de-nghi-cap-von',
    loadChildren:() =>
      import(
        './danh-sach-tong-hop-de-nghi-cap-von/danh-sach-tong-hop-de-nghi-cap-von.module'
        ).then((m) => m.DanhSachTongHopDeNghiCapVonModule),
  },

  {
    path:'tong-hop-de-nghi-cap-von',
    loadChildren: () =>
      import(
        './tong-hop-de-nghi-cap-von/tong-hop-de-nghi-cap-von.module'
        ).then((m) => m.TongHopDeNghiCapVonModule),
  },

  {
    path:'tong-hop-de-nghi-cap-von/:id',
    loadChildren: () =>
      import(
        './tong-hop-de-nghi-cap-von/tong-hop-de-nghi-cap-von.module'
        ).then((m) => m.TongHopDeNghiCapVonModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyCapNguonVonChiNSNNRoutingModule {}
