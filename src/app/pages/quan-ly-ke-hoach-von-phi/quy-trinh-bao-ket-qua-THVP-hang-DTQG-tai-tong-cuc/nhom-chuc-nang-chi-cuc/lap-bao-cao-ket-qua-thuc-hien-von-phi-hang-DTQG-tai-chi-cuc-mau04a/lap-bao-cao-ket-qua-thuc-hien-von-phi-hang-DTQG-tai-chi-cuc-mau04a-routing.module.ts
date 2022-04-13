import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aComponent } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.component';
const routes: Routes = [
  {
    path: '',
    component: LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aRoutingModule {}
