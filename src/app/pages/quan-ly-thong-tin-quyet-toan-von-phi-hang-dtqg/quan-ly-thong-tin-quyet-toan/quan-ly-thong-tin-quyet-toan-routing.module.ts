import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyThongTinQuyetToanComponent } from './quan-ly-thong-tin-quyet-toan.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyThongTinQuyetToanComponent,
  },
  {
    path: 'danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG',
    loadChildren: () =>
      import(
        './danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG/danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG.module'
      ).then((m) => m.DanhSachBaoCaoQuyetToanVonPhiHangDTQGModule),
  },
  {
    path: 'them-moi-bao-cao-quyet-toan',
    loadChildren: () =>
      import(
        './them-moi-bao-cao-quyet-toan/them-moi-bao-cao-quyet-toan.module'
      ).then((m) => m.ThemMoiBaoCaoQuyetToanModule),
  },
  {
    path: 'them-moi-bao-cao-quyet-toan/:id',
    loadChildren: () =>
      import(
        './them-moi-bao-cao-quyet-toan/them-moi-bao-cao-quyet-toan.module'
      ).then((m) => m.ThemMoiBaoCaoQuyetToanModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyThongTinQuyetToanRoutingModule {}
