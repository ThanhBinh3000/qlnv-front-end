import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachGhiNhanVonBanRoutingModule } from './danh-sach-ghi-nhan-von-ban-routing.module';
import { DanhSachGhiNhanVonBanComponent } from './danh-sach-ghi-nhan-von-ban.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachGhiNhanVonBanComponent,
  ],
  imports: [
    CommonModule,
    DanhSachGhiNhanVonBanRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachGhiNhanVonBanModule {}
