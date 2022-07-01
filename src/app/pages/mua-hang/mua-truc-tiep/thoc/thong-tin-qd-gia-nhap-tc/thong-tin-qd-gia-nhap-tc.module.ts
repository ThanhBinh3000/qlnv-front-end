import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { ThongTinQDGiaNhapComponent } from './thong-tin-qd-gia-nhap-tc.component';
import { ThongTinQDGiaNhapRoutingModule } from './thong-tin-qd-gia-nhap-tc-routing.module';

@NgModule({
  declarations: [ThongTinQDGiaNhapComponent],
  imports: [CommonModule, ThongTinQDGiaNhapRoutingModule, ComponentsModule],
})
export class ThongTinQDGiaNhapModule {}
