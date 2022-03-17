import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapThongTinNopTienVonBanHangLenBtcComponent } from './nhap-thong-tin-nop-tien-von-ban-hang-len-btc.component';

const routes: Routes = [
  {
    path: '',
    component: NhapThongTinNopTienVonBanHangLenBtcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapThongTinNopTienVonBanHangLenBtcRoutingModule {}
