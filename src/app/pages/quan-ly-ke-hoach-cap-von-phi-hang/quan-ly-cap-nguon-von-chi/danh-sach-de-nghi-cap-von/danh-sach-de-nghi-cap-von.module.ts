import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachDeNghiCapVonComponentRoutingModule } from './danh-sach-de-nghi-cap-von-routing.module';
import { DanhSachDeNghiCapVonComponent } from './danh-sach-de-nghi-cap-von.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachDeNghiCapVonComponent,
  ],
  imports: [
    CommonModule,
    DanhSachDeNghiCapVonComponentRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachDeNghiCapVonComponentModule {}
