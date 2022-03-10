import { XayDungKeHoachBaoQuanHangNamComponent } from './xay-dung-ke-hoach-bao-quan-hang-nam.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XayDungKeHoachBaoQuanHangNamRoutingModule } from './xay-dung-ke-hoach-bao-quan-hang-nam-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    XayDungKeHoachBaoQuanHangNamComponent,
  ],
  imports: [
    CommonModule,
    XayDungKeHoachBaoQuanHangNamRoutingModule,
    ComponentsModule,
  ],
})

export class XayDungKeHoachBaoQuanHangNamModule {}
