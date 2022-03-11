import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapTtTienVonMuaHangVonUngRoutingModule } from './nhap-tt-tien-von-mua-hang-von-ung-routing.module';
import { NhapTtTienVonMuaHangVonUngComponent } from './nhap-tt-tien-von-mua-hang-von-ung.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhapTtTienVonMuaHangVonUngComponent
  ],
  imports: [
    CommonModule,
    NhapTtTienVonMuaHangVonUngRoutingModule,
    ComponentsModule,
  ],
})

export class NhapTtTienVonMuaHangVonUngModule {}
