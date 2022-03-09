import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02Component } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau02.component';
const routes: Routes = [
  {
    path: '',
    component: LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02RoutingModule {}
