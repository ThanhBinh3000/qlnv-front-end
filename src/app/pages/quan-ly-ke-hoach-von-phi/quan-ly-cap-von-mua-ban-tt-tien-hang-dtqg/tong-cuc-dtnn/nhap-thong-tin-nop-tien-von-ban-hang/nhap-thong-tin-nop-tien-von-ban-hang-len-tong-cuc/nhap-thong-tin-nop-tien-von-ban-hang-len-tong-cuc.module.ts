import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapThongTinNopTienVonBanHangLenTongCucRoutingModule } from './nhap-thong-tin-nop-tien-von-ban-hang-len-tong-cuc-routing.module';
import { NhapThongTinNopTienVonBanHangLenTongCucComponent } from './nhap-thong-tin-nop-tien-von-ban-hang-len-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhapThongTinNopTienVonBanHangLenTongCucComponent
  ],
  imports: [
    CommonModule,
    NhapThongTinNopTienVonBanHangLenTongCucRoutingModule,
    ComponentsModule,
  ],
})

export class NhapThongTinNopTienVonBanHangLenTongCucModule {}
