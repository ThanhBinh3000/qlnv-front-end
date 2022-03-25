import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanThongTinNhanTienVonVmvuTuBtcRoutingModule } from './ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc-routing.module';
import { GhiNhanThongTinNhanTienVonVmvuTuBtcComponent } from './ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    GhiNhanThongTinNhanTienVonVmvuTuBtcComponent
  ],
  imports: [
    CommonModule,
    GhiNhanThongTinNhanTienVonVmvuTuBtcRoutingModule,
    ComponentsModule,
  ],
})

export class GhiNhanThongTinNhanTienVonVmvuTuBtcModule {}
