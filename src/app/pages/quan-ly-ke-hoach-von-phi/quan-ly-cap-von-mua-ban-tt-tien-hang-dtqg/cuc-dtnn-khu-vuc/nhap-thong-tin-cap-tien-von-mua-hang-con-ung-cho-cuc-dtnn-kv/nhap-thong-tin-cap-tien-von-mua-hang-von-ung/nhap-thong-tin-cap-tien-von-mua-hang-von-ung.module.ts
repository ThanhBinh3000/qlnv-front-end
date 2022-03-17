import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapThongTinCapTienVonMuaHangVonUngRoutingModule } from './nhap-thong-tin-cap-tien-von-mua-hang-von-ung-routing.module';
import { NhapThongTinCapTienVonMuaHangVonUngComponent } from './nhap-thong-tin-cap-tien-von-mua-hang-von-ung.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhapThongTinCapTienVonMuaHangVonUngComponent
  ],
  imports: [
    CommonModule,
    NhapThongTinCapTienVonMuaHangVonUngRoutingModule,
    ComponentsModule,
  ],
})

export class NhapThongTinCapTienVonMuaHangVonUngModule {}
