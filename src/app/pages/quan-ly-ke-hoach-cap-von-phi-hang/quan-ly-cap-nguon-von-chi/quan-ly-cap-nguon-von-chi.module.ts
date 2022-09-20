import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuanLyCapNguonVonChiNSNNRoutingModule } from './quan-ly-cap-nguon-von-chi-routing.module';
import { QuanLyCapNguonVonChiNSNNComponent } from './quan-ly-cap-nguon-von-chi.component';
@NgModule({
  declarations: [
    QuanLyCapNguonVonChiNSNNComponent,
  ],
  imports: [CommonModule, QuanLyCapNguonVonChiNSNNRoutingModule, ComponentsModule],
})
export class QuanLyCapNguonVonChiNSNNModule { }
