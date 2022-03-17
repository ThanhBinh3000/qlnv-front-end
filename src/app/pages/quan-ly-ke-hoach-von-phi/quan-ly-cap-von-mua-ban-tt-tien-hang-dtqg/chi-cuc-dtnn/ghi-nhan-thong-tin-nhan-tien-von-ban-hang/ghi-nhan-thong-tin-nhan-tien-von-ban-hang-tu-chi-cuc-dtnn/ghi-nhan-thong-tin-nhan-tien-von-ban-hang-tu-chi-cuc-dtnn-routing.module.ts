import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnComponent } from './ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-chi-cuc-dtnn.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnRoutingModule {}
