import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeHoachBaoQuanHangNamRoutingModule } from './ke-hoach-bao-quan-hang-nam-routing.module';
import { KeHoachBaoQuanHangNamComponent } from './ke-hoach-bao-quan-hang-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    KeHoachBaoQuanHangNamComponent,
  ],
  imports: [
    CommonModule,
    KeHoachBaoQuanHangNamRoutingModule,
    ComponentsModule,
  ],
})

export class KeHoachBaoQuanHangNamModule {}
