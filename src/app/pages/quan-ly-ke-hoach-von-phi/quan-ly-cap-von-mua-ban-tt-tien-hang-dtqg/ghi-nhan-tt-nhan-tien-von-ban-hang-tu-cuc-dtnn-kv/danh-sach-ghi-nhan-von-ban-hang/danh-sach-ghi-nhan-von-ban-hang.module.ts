import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachGhiNhanVonBanHangRoutingModule } from './danh-sach-ghi-nhan-von-ban-hang-routing.module';
import { DanhSachGhiNhanVonBanHangComponent } from './danh-sach-ghi-nhan-von-ban-hang.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachGhiNhanVonBanHangComponent,
  ],
  imports: [
    CommonModule,
    DanhSachGhiNhanVonBanHangRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachGhiNhanVonBanHangModule {}
