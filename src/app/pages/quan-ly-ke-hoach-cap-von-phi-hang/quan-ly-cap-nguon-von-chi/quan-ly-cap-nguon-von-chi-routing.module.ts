import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyCapNguonVonChiNSNNComponent } from './quan-ly-cap-nguon-von-chi.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyCapNguonVonChiNSNNComponent,
  },
  {
    path: 'tim-kiem',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  {
    path:'lap-de-nghi-cap-von-mua-vat-tu-thiet-bi',
    loadChildren: () => 
    import(
      './lap-de-nghi-cap-von-mua-vat-tu-thiet-bi/lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.module'
    ).then((m) => m.LapDeNghiCapVonMuaVatTuThietBiModule),
  },
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyCapNguonVonChiNSNNRoutingModule {}
