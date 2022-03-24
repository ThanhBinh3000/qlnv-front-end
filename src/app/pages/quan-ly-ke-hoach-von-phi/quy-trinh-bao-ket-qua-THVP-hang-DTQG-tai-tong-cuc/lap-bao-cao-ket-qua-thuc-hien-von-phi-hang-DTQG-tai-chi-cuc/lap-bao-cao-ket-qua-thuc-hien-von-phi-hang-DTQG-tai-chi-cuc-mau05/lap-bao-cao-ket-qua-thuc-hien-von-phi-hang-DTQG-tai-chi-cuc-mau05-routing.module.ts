import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05Component } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05.component';
const routes: Routes = [
  {
    path: '',
    component: LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05RoutingModule {}
