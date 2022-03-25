import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachGhiNhanThongTinNhanTienVonVonBanHangTuCucDtnnKhuVucRoutingModule } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc-routing.module';
import { DanhSachGhiNhanThongTinNhanTienVonVonBanHangTuCucDtnnKhuVucComponent } from './danh-sach-ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachGhiNhanThongTinNhanTienVonVonBanHangTuCucDtnnKhuVucComponent,
  ],
  imports: [
    CommonModule,
    DanhSachGhiNhanThongTinNhanTienVonVonBanHangTuCucDtnnKhuVucRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachGhiNhanThongTinNhanTienVonVonBanHangTuCucDtnnKhuVucModule {}
