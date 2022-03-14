import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanTtNopTienVonBanHangRoutingModule } from './ghi-nhan-tt-nop-tien-von-ban-hang-routing.module';
import { GhiNhanTtNopTienVonBanHangComponent } from './ghi-nhan-tt-nop-tien-von-ban-hang.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    GhiNhanTtNopTienVonBanHangComponent
  ],
  imports: [
    CommonModule,
    GhiNhanTtNopTienVonBanHangRoutingModule,
    ComponentsModule,
  ],
})

export class GhiNhanTtNopTienVonBanHangModule {}
