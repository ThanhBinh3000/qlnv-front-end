import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachGhiNhanThongTinNhanTienVonVmvuTuBtcComponent } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachGhiNhanThongTinNhanTienVonVmvuTuBtcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachGhiNhanThongTinNhanTienVonVmvuTuBtcRoutingModule {}
