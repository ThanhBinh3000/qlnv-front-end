import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuanLyThongTinQuyetToanComponent } from './quan-ly-thong-tin-quyet-toan.component';
import { QuanLyThongTinQuyetToanRoutingModule } from './quan-ly-thong-tin-quyet-toan-routing.module';


@NgModule({
  declarations: [
    QuanLyThongTinQuyetToanComponent,
  ],
  imports: [CommonModule, QuanLyThongTinQuyetToanRoutingModule, ComponentsModule],
})
export class QuanLyThongTinQuyetToanModule {}
