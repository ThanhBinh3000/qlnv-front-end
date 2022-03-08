import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DuToanXuatNhapHangDtqgHangNamRoutingModule } from './du-toan-xuat-nhap-hang-dtqg-hang-nam-routing.module';
import { DuToanXuatNhapHangDtqgHangNamComponent } from './ du-toan-xuat-nhap-hang-dtqg-hang-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DuToanXuatNhapHangDtqgHangNamComponent,
  ],
  imports: [
    CommonModule,
    DuToanXuatNhapHangDtqgHangNamRoutingModule,
    ComponentsModule,
  ],
})

export class DuToanXuatNhapHangDtqgHangNamModule {}
