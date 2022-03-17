import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnRoutingModule } from './nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn-routing.module';
import { NhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnComponent } from './nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnComponent
  ],
  imports: [
    CommonModule,
    NhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnRoutingModule,
    ComponentsModule,
  ],
})

export class NhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnModule {}
