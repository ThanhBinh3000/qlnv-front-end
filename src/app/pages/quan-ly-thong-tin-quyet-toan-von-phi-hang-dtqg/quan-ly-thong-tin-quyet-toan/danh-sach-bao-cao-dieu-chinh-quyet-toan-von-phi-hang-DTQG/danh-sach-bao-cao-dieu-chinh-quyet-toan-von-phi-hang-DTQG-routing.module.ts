import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGComponent } from './danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [DatePipe],
  exports: [RouterModule],
})
export class DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGRoutingModule {}
