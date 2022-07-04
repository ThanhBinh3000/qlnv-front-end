import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DanhSachBaoCaoQuyetToanVonPhiHangDTQGRoutingModule } from './danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG-routing.module';
import { DanhSachBaoCaoQuyetToanVonPhiHangDTQGComponent } from './danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG.component';

@NgModule({
  declarations: [
    DanhSachBaoCaoQuyetToanVonPhiHangDTQGComponent,
  ],
  imports: [
    CommonModule,
    DanhSachBaoCaoQuyetToanVonPhiHangDTQGRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachBaoCaoQuyetToanVonPhiHangDTQGModule {}
