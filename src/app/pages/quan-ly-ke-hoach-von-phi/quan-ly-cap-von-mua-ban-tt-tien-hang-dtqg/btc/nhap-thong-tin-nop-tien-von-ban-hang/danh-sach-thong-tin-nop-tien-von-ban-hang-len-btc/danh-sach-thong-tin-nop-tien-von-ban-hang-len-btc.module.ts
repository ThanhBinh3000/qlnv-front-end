import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachThongTinNopTienVonBanHangLenBtcRoutingModule } from './danh-sach-thong-tin-nop-tien-von-ban-hang-len-btc-routing.module';
import { DanhSachThongTinNopTienVonBanHangLenBtcComponent } from './danh-sach-thong-tin-nop-tien-von-ban-hang-len-btc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachThongTinNopTienVonBanHangLenBtcComponent,
  ],
  imports: [
    CommonModule,
    DanhSachThongTinNopTienVonBanHangLenBtcRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachThongTinNopTienVonBanHangLenBtcModule {}
