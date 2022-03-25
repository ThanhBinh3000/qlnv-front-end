import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachGhiNhanThongTinNhanTienVonVonBanHangTuCucDtnnKhuVucComponent } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachGhiNhanThongTinNhanTienVonVonBanHangTuCucDtnnKhuVucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachGhiNhanThongTinNhanTienVonVonBanHangTuCucDtnnKhuVucRoutingModule {}
