import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { QuanLyCapNguonVonChiNSNNComponent } from './quan-ly-cap-nguon-von-chi.component';
import { QuanLyCapNguonVonChiNSNNRoutingModule } from './quan-ly-cap-nguon-von-chi-routing.module';

@NgModule({
  declarations: [
    QuanLyCapNguonVonChiNSNNComponent,    
  ],
  imports: [CommonModule, QuanLyCapNguonVonChiNSNNRoutingModule, ComponentsModule],
})
export class QuanLyCapNguonVonChiNSNNModule {}
