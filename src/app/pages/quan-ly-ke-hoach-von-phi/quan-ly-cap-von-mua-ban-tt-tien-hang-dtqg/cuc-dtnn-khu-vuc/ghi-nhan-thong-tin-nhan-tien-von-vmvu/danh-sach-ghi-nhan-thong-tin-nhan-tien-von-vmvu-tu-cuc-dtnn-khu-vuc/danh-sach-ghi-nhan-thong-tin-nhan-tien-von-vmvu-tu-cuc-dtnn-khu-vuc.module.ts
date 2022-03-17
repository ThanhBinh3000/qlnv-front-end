import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachGhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucRoutingModule } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc-routing.module';
import { DanhSachGhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucComponent } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachGhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucComponent,
  ],
  imports: [
    CommonModule,
    DanhSachGhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachGhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucModule {}
