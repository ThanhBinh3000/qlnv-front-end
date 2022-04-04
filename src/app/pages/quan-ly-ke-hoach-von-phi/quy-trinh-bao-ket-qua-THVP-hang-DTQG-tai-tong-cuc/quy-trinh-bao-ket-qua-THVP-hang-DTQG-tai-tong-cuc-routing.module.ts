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
    path: 'duyet-bao-cao-thuc-hien-von-phi-hang-dtqg',
    loadChildren: () =>
      import(
        './duyet-bao-cao-thuc-hien-von-phi/duyet-bao-cao-thuc-hien-von-phi.module'
      ).then((m) => m.DuyetBaoCaoThucHienVonPhiModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/:id',
    loadChildren: () =>
      import(
        './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aModule),
  },
  // {
  //   path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a/:maDvi/:maLoaiBaocao/:nam/:dotBaocao',
  //   loadChildren: () =>
  //     import(
  //       './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.module'
  //     ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aModule),
  // },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a-/:loai',
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
