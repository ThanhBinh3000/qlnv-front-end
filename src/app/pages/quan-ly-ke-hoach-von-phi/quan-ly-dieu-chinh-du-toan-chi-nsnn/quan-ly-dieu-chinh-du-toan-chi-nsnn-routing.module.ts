import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyDieuChinhDuToanChiNSNNComponent } from './quan-ly-dieu-chinh-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyDieuChinhDuToanChiNSNNComponent,
  },
  {
    path: 'danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach',
    loadChildren: () =>
      import(
        './danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach/danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach.module'
      ).then((m) => m.DanhSachDeXuatDieuChinhDuToanChiNganSachModule),
  },
  {
    path: 'danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi',
    loadChildren: () =>
      import(
        './danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi/danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.module'
      ).then((m) => m.DanhSachKeHoachPhanBoGiaoDuToanCuaDonViModule),
  },
  {
    path: 'lap-bao-cao-dieu-chinh-du-toan-chi-nsnn',
    loadChildren: () =>
      import(
        './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.module'
      ).then((m) => m.LapBaoCaoDieuChinhDuToanChiNsnnModule),
  },
  {
    path: 'lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/:id',
    loadChildren: () =>
      import(
        './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.module'
      ).then((m) => m.LapBaoCaoDieuChinhDuToanChiNsnnModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyDieuChinhDuToanChiNSNNRoutingModule {}
