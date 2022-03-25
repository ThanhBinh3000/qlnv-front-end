import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucComponent } from './ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucRoutingModule {}
