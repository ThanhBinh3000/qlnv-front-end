import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XayDungKeHoachQuyTienLuong3NamRoutingModule } from './xay-dung-ke-hoach-quy-tien-luong3-nam-routing.module';
import { XayDungKeHoachQuyTienLuong3NamComponent } from './xay-dung-ke-hoach-quy-tien-luong3-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    XayDungKeHoachQuyTienLuong3NamComponent,
  ],
  imports: [
    CommonModule,
    XayDungKeHoachQuyTienLuong3NamRoutingModule,
    ComponentsModule,
  ],
})

export class XayDungKeHoachQuyTienLuong3NamModule {}
