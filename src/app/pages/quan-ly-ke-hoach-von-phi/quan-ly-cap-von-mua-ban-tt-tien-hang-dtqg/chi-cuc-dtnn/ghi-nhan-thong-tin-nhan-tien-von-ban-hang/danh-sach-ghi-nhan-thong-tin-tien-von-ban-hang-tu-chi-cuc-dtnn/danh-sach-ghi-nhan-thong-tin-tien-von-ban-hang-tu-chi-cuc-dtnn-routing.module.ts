import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachGhiNhanThongTinTienVonVonBanHangTuChiCucDtnnComponent } from './danh-sach-ghi-nhan-thong-tin-tien-von-ban-hang-tu-chi-cuc-dtnn.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachGhiNhanThongTinTienVonVonBanHangTuChiCucDtnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachGhiNhanThongTinTienVonVonBanHangTuChiCucDtnnRoutingModule {}
