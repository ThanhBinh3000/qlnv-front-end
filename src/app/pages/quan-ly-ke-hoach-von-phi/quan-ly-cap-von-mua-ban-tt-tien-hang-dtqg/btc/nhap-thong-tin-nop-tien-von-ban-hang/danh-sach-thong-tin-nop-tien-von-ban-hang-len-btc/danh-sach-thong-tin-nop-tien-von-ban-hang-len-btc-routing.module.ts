import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachThongTinNopTienVonBanHangLenBtcComponent } from './danh-sach-thong-tin-nop-tien-von-ban-hang-len-btc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachThongTinNopTienVonBanHangLenBtcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachThongTinNopTienVonBanHangLenBtcRoutingModule {}
