import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachGhiNhanThongTinNhanTienVonVmvuTuBtcRoutingModule } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-routing.module';
import { DanhSachGhiNhanThongTinNhanTienVonVmvuTuBtcComponent } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachGhiNhanThongTinNhanTienVonVmvuTuBtcComponent,
  ],
  imports: [
    CommonModule,
    DanhSachGhiNhanThongTinNhanTienVonVmvuTuBtcRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachGhiNhanThongTinNhanTienVonVmvuTuBtcModule {}
