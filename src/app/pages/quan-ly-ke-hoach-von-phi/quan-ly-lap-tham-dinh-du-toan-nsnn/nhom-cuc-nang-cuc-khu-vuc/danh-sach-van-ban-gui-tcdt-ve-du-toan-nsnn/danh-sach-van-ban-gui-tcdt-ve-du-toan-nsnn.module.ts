import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachVanBanGuiTcdtVeDuToanNsnnRoutingModule } from './danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn-routing.module';
import { DanhSachVanBanGuiTcdtVeDuToanNsnnComponent } from './danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachVanBanGuiTcdtVeDuToanNsnnComponent,
  ],
  imports: [
    CommonModule,
    DanhSachVanBanGuiTcdtVeDuToanNsnnRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachVanBanGuiTcdtVeDuToanNsnnModule {}
