import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent } from './tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGRoutingModule {}
