import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanThongTinNhanTienVonVmvuTuBtcComponent } from './ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanThongTinNhanTienVonVmvuTuBtcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanThongTinNhanTienVonVmvuTuBtcRoutingModule {}
