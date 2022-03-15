import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent } from './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent,
  },
  {
    path: 'tim-kiem-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg',
    loadChildren: () =>
      import(
        './tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG/tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.module'
      ).then((m) => m.TimKiemBaoCaoThucHienVonPhiHangDTQGModule),
  },
  {
    path: 'tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg',
    loadChildren: () =>
      import(
        './tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG/tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.module'
      ).then((m) => m.TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau02',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau02/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau02.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02Module),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau02/:id',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau02/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau02.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02Module),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau02/:maDvi/:maLoaiBaocao/:nam/:dotBaocao',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau02/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau02.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02Module),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau03',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03Module),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau03/:id',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03Module),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau03/:maDvi/:maLoaiBaocao/:nam/:dotBaocao',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03Module),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucRoutingModule {}
