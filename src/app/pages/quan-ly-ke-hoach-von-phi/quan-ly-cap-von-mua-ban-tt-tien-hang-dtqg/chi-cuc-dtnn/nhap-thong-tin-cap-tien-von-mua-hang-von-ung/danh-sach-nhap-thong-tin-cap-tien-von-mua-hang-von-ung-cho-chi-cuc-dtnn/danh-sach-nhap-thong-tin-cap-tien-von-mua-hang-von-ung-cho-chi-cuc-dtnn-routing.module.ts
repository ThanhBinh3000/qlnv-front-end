import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachNhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnComponent } from './danh-sach-nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachNhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachNhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnRoutingModule {}
