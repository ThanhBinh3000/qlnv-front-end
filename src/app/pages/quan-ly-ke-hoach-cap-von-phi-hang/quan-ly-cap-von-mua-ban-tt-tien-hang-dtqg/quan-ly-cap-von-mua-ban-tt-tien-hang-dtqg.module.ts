import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuanLyCapVonMuaBanTtTienHangDtqgRoutingModule } from './quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg-routing.module';
import { QuanLyCapVonMuaBanTtTienHangDtqgComponent } from './quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [QuanLyCapVonMuaBanTtTienHangDtqgComponent],
  imports: [CommonModule, QuanLyCapVonMuaBanTtTienHangDtqgRoutingModule, ComponentsModule],
})
export class QuanLyCapVonMuaBanTtTienHangDtqgModule {}
