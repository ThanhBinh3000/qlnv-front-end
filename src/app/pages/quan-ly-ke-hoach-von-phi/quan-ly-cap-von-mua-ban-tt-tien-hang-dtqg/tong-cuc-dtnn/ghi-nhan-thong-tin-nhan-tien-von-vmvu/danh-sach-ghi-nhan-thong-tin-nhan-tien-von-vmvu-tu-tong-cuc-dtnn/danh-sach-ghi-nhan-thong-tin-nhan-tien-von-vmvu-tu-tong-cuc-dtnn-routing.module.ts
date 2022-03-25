import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachGhiNhanThongTinNhanTienVonVmvuTaiTongCucDtnnComponent } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachGhiNhanThongTinNhanTienVonVmvuTaiTongCucDtnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachGhiNhanThongTinNhanTienVonVmvuTaiTongCucDtnnRoutingModule {}
