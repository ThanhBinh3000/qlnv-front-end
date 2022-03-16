import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachGhiNhanThongTinTienVonVonBanHangTuChiCucDtnnRoutingModule } from './danh-sach-ghi-nhan-thong-tin-tien-von-ban-hang-tu-chi-cuc-dtnn-routing.module';
import { DanhSachGhiNhanThongTinTienVonVonBanHangTuChiCucDtnnComponent } from './danh-sach-ghi-nhan-thong-tin-tien-von-ban-hang-tu-chi-cuc-dtnn.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachGhiNhanThongTinTienVonVonBanHangTuChiCucDtnnComponent,
  ],
  imports: [
    CommonModule,
    DanhSachGhiNhanThongTinTienVonVonBanHangTuChiCucDtnnRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachGhiNhanThongTinTienVonVonBanHangTuChiCucDtnnModule {}
