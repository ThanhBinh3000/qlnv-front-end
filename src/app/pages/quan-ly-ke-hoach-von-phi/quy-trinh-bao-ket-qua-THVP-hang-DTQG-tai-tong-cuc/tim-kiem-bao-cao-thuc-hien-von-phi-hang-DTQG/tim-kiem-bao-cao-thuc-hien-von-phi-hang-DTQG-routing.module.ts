import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemBaoCaoThucHienVonPhiHangDTQGComponent } from './tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemBaoCaoThucHienVonPhiHangDTQGComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemBaoCaoThucHienVonPhiHangDTQGRoutingModule {}
