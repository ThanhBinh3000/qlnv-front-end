import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03RoutingModule } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03-routing.module';
import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03Component } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03Component],
  imports: [CommonModule, LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03RoutingModule, ComponentsModule],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03Module {}
