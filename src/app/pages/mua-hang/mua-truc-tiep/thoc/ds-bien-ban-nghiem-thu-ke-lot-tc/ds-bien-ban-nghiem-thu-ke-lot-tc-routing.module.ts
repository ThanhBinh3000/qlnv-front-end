import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsBienBanNghiemThuKeLotTCComponent } from './ds-bien-ban-nghiem-thu-ke-lot-tc.component';

const routes: Routes = [
  {
    path: '',
    component: DsBienBanNghiemThuKeLotTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsBienBanNghiemThuKeLotTCRoutingModule {}
