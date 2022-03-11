import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GhiNhanVonBanHangRoutingModule } from './ghi-nhan-von-ban-hang-routing.module';
import { GhiNhanVonBanHangComponent } from './ghi-nhan-von-ban-hang.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    GhiNhanVonBanHangComponent
  ],
  imports: [
    CommonModule,
    GhiNhanVonBanHangRoutingModule,
    ComponentsModule,
  ],
})

export class GhiNhanVonBanHangModule {}
