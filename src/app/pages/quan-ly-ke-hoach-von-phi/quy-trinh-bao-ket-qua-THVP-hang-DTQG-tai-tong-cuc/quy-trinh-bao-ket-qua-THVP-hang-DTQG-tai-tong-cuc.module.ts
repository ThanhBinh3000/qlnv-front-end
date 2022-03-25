import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucRoutingModule } from './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc-routing.module';
import { QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent } from './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent],
  imports: [CommonModule, QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucRoutingModule, ComponentsModule],
})
export class QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucModule {}
