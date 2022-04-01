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
    path: 'khai-thac-bao-cao',
    loadChildren: () =>
      import(
        './khai-thac-bao-cao/khai-thac-bao-cao.module'
      ).then((m) => m.KhaiThacBaoCaoModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a/:id',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a/:maDvi/:maLoaiBaocao/:nam/:dotBaocao',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a-/:loai',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04b',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04bModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04b/:id',
    loadChildren: () =>
    import(
      './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b.module'
    ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04bModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04b/:id/:status',
    loadChildren: () =>
    import(
      './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b.module'
    ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04bModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04b/:maDvi/:maLoaiBaocao/:nam/:dotBaocao',
    loadChildren: () =>
    import(
      './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b.module'
    ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04bModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau05',
    loadChildren: () =>
    import(
      './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05.module'
    ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05Module),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau05/:id',
    loadChildren: () =>
    import(
      './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05.module'
    ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05Module),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau05/:id/:status',
    loadChildren: () =>
    import(
      './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05.module'
    ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05Module),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau05/:maDvi/:maLoaiBaocao/:nam/:dotBaocao',
    loadChildren: () =>
    import(
      './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05.module'
    ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05Module),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucRoutingModule {}
