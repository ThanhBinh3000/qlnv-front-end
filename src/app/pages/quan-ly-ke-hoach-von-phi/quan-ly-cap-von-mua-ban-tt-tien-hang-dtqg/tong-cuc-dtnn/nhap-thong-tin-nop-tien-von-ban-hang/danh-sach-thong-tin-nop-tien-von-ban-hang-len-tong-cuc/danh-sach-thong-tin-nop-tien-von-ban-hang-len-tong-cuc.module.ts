import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachThongTinNopTienVonBanHangLenTongCucRoutingModule } from './danh-sach-thong-tin-nop-tien-von-ban-hang-len-tong-cuc-routing.module';
import { DanhSachThongTinNopTienVonBanHangLenTongCucComponent } from './danh-sach-thong-tin-nop-tien-von-ban-hang-len-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachThongTinNopTienVonBanHangLenTongCucComponent,
  ],
  imports: [
    CommonModule,
    DanhSachThongTinNopTienVonBanHangLenTongCucRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachThongTinNopTienVonBanHangLenTongCucModule {}
