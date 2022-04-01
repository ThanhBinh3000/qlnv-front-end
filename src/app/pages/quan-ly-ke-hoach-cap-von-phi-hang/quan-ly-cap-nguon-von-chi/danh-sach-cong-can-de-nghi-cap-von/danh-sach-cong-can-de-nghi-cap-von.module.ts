import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachCongVanDeNghiCapVonComponentRoutingModule } from './danh-sach-cong-can-de-nghi-cap-von-routing.module';
import { DanhSachCongVanDeNghiCapVonComponent } from './danh-sach-cong-can-de-nghi-cap-von.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachCongVanDeNghiCapVonComponent,
  ],
  imports: [
    CommonModule,
    DanhSachCongVanDeNghiCapVonComponentRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachCongVanDeNghiCapVonComponentModule {}
