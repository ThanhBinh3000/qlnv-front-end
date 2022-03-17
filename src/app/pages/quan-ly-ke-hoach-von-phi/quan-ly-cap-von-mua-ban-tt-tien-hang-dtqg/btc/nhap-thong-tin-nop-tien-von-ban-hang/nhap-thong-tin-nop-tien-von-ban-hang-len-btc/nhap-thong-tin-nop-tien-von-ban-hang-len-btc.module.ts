import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapThongTinNopTienVonBanHangLenBtcRoutingModule } from './nhap-thong-tin-nop-tien-von-ban-hang-len-btc-routing.module';
import { NhapThongTinNopTienVonBanHangLenBtcComponent } from './nhap-thong-tin-nop-tien-von-ban-hang-len-btc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhapThongTinNopTienVonBanHangLenBtcComponent
  ],
  imports: [
    CommonModule,
    NhapThongTinNopTienVonBanHangLenBtcRoutingModule,
    ComponentsModule,
  ],
})

export class NhapThongTinNopTienVonBanHangLenBtcModule {}
