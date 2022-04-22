import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThongTinBienBanNghiemThuKeLotTCComponent } from './thong-tin-bien-ban-nghiem-thu-ke-lot-tc.component';

const routes: Routes = [
  {
    path: '',
    component: ThongTinBienBanNghiemThuKeLotTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThongTinBienBanNghiemThuKeLotTCRoutingModule {}
