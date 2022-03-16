import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnComponent } from './ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnRoutingModule {}
