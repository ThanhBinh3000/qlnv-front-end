import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachNhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnRoutingModule } from './danh-sach-nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn-routing.module';
import { DanhSachNhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnComponent } from './danh-sach-nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachNhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnComponent,
  ],
  imports: [
    CommonModule,
    DanhSachNhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachNhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnModule {}
