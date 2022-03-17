import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachGhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucComponent } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachGhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachGhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucRoutingModule {}
