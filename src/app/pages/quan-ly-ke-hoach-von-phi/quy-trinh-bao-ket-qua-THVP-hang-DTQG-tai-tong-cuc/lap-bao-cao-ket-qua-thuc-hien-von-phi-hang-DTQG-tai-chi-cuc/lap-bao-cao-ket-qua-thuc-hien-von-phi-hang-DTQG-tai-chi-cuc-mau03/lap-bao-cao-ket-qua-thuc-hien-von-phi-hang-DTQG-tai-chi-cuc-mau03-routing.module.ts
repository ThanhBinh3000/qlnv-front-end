import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03Component } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03.component';
const routes: Routes = [
  {
    path: '',
    component: LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03RoutingModule {}
