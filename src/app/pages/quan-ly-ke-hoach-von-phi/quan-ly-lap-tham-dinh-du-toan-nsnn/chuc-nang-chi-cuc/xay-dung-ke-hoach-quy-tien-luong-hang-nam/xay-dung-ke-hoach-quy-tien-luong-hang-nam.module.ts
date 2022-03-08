import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XayDungKeHoachQuyTienLuongHangNamComponent } from './xay-dung-ke-hoach-quy-tien-luong-hang-nam.component';
import { XayDungKeHoachQuyTienLuongHangNamRoutingModule } from './xay-dung-ke-hoach-quy-tien-luong-hang-nam-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    XayDungKeHoachQuyTienLuongHangNamComponent,
  ],
  imports: [
    CommonModule,
    XayDungKeHoachQuyTienLuongHangNamRoutingModule,
    ComponentsModule,
  ],
})

export class XayDungKeHoachQuyTienLuongHangNamModule {}
