import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachThongTinNopTienVonBanHangLenTongCucComponent } from './danh-sach-thong-tin-nop-tien-von-ban-hang-len-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachThongTinNopTienVonBanHangLenTongCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachThongTinNopTienVonBanHangLenTongCucRoutingModule {}
