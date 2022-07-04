import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyKeHoachVonPhiComponent } from './quan-ly-ke-hoach-von-phi.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyKeHoachVonPhiComponent,
    children: [
      {
        path: '',
        redirectTo: 'nguoi-dung',
        pathMatch: 'full',
      },
      {
        path: 'quan-ly-lap-tham-dinh-du-toan-nsnn',
        loadChildren: () =>
          import('./quan-ly-lap-tham-dinh-du-toan-nsnn/quan-ly-lap-tham-dinh-du-toan-nsnn.module').then(
            (m) => m.QuanLyLapThamDinhDuToanNSNNModule,
          ),
      },
      {
        path: 'quan-ly-dieu-chinh-du-toan-chi-nsnn',
        loadChildren: () =>
          import('./quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.module').then(
            (m) => m.QuanLyDieuChinhDuToanChiNSNNModule,
          ),
      },
      {
        path: 'quan-ly-giao-du-toan-chi-nsnn',
        loadChildren: () =>
          import('./quan-ly-giao-du-toan-chi-nsnn/quan-ly-giao-du-toan-chi-nsnn.module').then(
            (m) => m.QuanLyDieuChinhDuToanChiNSNNModule,
          ),
      },
      {
        path: 'quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg',
        loadChildren: () =>
          import('./quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg/quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.module').then(
            (m) => m.QuanLyCapVonMuaBanTtTienHangDtqgModule,
          ),
      },
      {
        path: 'quy-trinh-bc-thuc-hien-du-toan-chi-nsnn',
        loadChildren: () =>
          import('./quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn/quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn.module').then(
            (m) => m.QuyTrinhBaoCaoThucHienDuToanChiNSNNModule,
          ),
      },
      {
        path: 'quy-trinh-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-tong-cuc-dtnn',
        loadChildren: () =>
          import('./quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc/quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.module').then(
            (m) => m.QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucModule,
          ),
      },
      {
        path: 'danh-muc-qlkh-von-phi',
        loadChildren: () =>
          import('./danh-muc-qlkh-von-phi/danh-muc-qlkh-von-phi.module').then(
            (m) => m.DanhMucQlkhVonPhiModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyKeHoachVonPhiRoutingModule { }
