import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapThongTinCapTienVonMuaHangVonUngComponent } from './nhap-thong-tin-cap-tien-von-mua-hang-von-ung.component';

const routes: Routes = [
  {
    path: '',
    component: NhapThongTinCapTienVonMuaHangVonUngComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapThongTinCapTienVonMuaHangVonUngRoutingModule {}
