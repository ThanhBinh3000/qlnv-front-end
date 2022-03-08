import { XayDungNhuCauNhapXuatHangNamComponent } from './xay-dung-nhu-cau-nhap-xuat-hang-nam.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XayDungNhuCauNhapXuatHangNamRoutingModule } from './xay-dung-nhu-cau-nhap-xuat-hang-nam-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    XayDungNhuCauNhapXuatHangNamComponent,
  ],
  imports: [
    CommonModule,
    XayDungNhuCauNhapXuatHangNamRoutingModule,
    ComponentsModule,
  ],
})

export class XayDungNhuCauNhapXuatHangNamModule {}
