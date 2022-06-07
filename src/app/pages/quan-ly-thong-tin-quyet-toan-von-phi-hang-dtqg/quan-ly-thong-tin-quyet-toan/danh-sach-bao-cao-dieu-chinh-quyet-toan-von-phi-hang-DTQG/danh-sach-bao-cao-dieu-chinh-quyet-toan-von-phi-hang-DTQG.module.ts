import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGComponent } from './danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG.component';
import { DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGRoutingModule } from './danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG-routing.module';

@NgModule({
  declarations: [
    DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGComponent,
  ],
  imports: [
    CommonModule,
    DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGModule {}
