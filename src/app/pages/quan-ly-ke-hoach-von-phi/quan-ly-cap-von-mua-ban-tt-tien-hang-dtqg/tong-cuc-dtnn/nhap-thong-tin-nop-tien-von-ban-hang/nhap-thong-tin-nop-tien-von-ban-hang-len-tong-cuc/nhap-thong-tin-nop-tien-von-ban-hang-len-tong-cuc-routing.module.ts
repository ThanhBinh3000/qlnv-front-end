import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapThongTinNopTienVonBanHangLenTongCucComponent } from './nhap-thong-tin-nop-tien-von-ban-hang-len-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: NhapThongTinNopTienVonBanHangLenTongCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapThongTinNopTienVonBanHangLenTongCucRoutingModule {}
