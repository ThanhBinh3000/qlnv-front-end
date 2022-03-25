import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02RoutingModule } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau02-routing.module';
import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02Component } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau02.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02Component],
  imports: [CommonModule, LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02RoutingModule, ComponentsModule],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau02Module {}
