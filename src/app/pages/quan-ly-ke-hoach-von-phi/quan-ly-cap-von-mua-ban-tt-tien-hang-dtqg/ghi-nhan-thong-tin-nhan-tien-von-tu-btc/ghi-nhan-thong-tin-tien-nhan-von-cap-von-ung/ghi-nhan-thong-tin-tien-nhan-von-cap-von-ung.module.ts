import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanThongTinTienNhanVonCapVonUngRoutingModule } from './ghi-nhan-thong-tin-tien-nhan-von-cap-von-ung-routing.module';
import { GhiNhanThongTinTienNhanVonCapVonUngComponent } from './ghi-nhan-thong-tin-tien-nhan-von-cap-von-ung.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    GhiNhanThongTinTienNhanVonCapVonUngComponent
  ],
  imports: [
    CommonModule,
    GhiNhanThongTinTienNhanVonCapVonUngRoutingModule,
    ComponentsModule,
  ],
})

export class GhiNhanThongTinTienNhanVonCapVonUngModule {}
