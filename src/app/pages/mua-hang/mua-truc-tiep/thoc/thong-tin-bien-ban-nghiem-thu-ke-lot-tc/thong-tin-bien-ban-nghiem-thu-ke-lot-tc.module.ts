import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { ThongTinBienBanNghiemThuKeLotTCRoutingModule } from './thong-tin-bien-ban-nghiem-thu-ke-lot-tc-routing.module';
import { ThongTinBienBanNghiemThuKeLotTCComponent } from './thong-tin-bien-ban-nghiem-thu-ke-lot-tc.component';

@NgModule({
  declarations: [ThongTinBienBanNghiemThuKeLotTCComponent],
  imports: [
    CommonModule,
    ThongTinBienBanNghiemThuKeLotTCRoutingModule,
    ComponentsModule,
  ],
})
export class ThongTinBienBanNghiemThuKeLotTCModule {}
