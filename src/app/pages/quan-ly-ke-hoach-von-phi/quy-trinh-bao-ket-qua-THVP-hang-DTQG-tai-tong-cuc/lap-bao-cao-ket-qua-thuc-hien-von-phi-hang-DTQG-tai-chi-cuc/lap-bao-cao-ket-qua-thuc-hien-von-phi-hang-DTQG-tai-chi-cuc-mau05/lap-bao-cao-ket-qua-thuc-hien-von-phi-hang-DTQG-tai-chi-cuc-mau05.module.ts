import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05RoutingModule } from '../lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05-routing.module';
import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05Component } from '../lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau05.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05Component],
  imports: [CommonModule, LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05RoutingModule, ComponentsModule],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau05Module {}
