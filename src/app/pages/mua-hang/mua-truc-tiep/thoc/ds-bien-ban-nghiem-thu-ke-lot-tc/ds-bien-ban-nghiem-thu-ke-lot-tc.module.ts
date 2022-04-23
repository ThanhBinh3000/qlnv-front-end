import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsBienBanNghiemThuKeLotTCComponent } from './ds-bien-ban-nghiem-thu-ke-lot-tc.component';
import { DsBienBanNghiemThuKeLotTCRoutingModule } from './ds-bien-ban-nghiem-thu-ke-lot-tc-routing.module';

@NgModule({
  declarations: [DsBienBanNghiemThuKeLotTCComponent],
  imports: [
    CommonModule,
    DsBienBanNghiemThuKeLotTCRoutingModule,
    ComponentsModule,
  ],
})
export class DsBienBanNghiemThuKeLotTCModule {}
