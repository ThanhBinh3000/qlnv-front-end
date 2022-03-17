import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnRoutingModule } from './ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-chi-cuc-dtnn-routing.module';
import { GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnComponent } from './ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-chi-cuc-dtnn.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnComponent
  ],
  imports: [
    CommonModule,
    GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnRoutingModule,
    ComponentsModule,
  ],
})

export class GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnModule {}
