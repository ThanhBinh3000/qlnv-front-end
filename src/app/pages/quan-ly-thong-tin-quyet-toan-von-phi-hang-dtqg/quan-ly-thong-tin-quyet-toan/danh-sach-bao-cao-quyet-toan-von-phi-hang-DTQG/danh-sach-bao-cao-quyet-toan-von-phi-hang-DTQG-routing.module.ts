import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachBaoCaoQuyetToanVonPhiHangDTQGComponent } from './danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachBaoCaoQuyetToanVonPhiHangDTQGComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [DatePipe],
  exports: [RouterModule],
})
export class DanhSachBaoCaoQuyetToanVonPhiHangDTQGRoutingModule {}
