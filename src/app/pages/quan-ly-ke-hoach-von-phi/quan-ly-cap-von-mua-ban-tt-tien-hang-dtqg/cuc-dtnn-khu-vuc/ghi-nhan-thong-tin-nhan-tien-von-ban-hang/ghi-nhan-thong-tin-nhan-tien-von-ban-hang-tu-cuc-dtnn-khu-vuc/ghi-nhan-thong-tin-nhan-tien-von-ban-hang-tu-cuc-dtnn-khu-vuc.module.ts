import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucRoutingModule } from './ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc-routing.module';
import { GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucComponent } from './ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucComponent
  ],
  imports: [
    CommonModule,
    GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucRoutingModule,
    ComponentsModule,
  ],
})

export class GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucModule {}
