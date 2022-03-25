import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04bRoutingModule } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b-routing.module';
import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04bComponent } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04b.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04bComponent],
  imports: [CommonModule, LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04bRoutingModule, ComponentsModule],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04bModule {}
