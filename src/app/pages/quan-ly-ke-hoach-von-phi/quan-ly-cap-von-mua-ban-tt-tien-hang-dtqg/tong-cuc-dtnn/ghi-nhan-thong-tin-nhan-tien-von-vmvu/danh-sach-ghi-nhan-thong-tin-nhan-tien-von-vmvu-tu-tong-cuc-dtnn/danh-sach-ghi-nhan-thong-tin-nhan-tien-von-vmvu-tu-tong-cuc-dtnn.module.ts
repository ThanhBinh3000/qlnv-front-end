import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachGhiNhanThongTinNhanTienVonVmvuTaiTongCucDtnnRoutingModule } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn-routing.module';
import { DanhSachGhiNhanThongTinNhanTienVonVmvuTaiTongCucDtnnComponent } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachGhiNhanThongTinNhanTienVonVmvuTaiTongCucDtnnComponent,
  ],
  imports: [
    CommonModule,
    DanhSachGhiNhanThongTinNhanTienVonVmvuTaiTongCucDtnnRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachGhiNhanThongTinNhanTienVonVmvuTaiTongCucDtnnModule {}
