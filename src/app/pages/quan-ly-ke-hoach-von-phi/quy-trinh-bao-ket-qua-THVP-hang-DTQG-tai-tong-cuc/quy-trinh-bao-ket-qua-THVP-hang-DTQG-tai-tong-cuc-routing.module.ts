import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent } from './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent,
  },
  {
    path: 'lap-bao-cao/:loai',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-chi-cuc/bao-cao/bao-cao.module'
      ).then((m) => m.BaoCaoModule),
  },
  {
    path: 'lap-bao-cao-chi-tiet/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-chi-cuc/bao-cao/bao-cao.module'
      ).then((m) => m.BaoCaoModule),
  },
  {
    path: 'tim-kiem-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-chi-cuc/tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG/tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.module'
      ).then((m) => m.TimKiemBaoCaoThucHienVonPhiHangDTQGModule),
  },
  {
    path: 'tong-hop-bao-tu-chi-cuc',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-khu-vuc/tong-hop-bao-cao/tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG/tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.module'
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
        './nhom-chuc-nang-khu-vuc/duyet-bao-cao-thuc-hien-von-phi/duyet-bao-cao-thuc-hien-von-phi.module'
      ).then((m) => m.DuyetBaoCaoThucHienVonPhiModule),
  },
  {
    path: 'kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-khu-vuc/tong-hop-bao-cao/kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc/kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc.module'
      ).then((m) => m.KiemTraTinhTrangPheDuyetBaoCaoTuChiCucModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a/:namBcao/:maLoaiBcao/:dotBcao',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a-routing.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aRoutingModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a/:namBcao/:maLoaiBcao',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a-routing.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aRoutingModule),
  },
  {
    path: 'lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a-/:loai/:namBaoCao/:dotBaoCao',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.module'
      ).then((m) => m.LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aModule),
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucRoutingModule {}
