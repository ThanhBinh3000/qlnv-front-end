import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aRoutingModule } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a-routing.module';
import { LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aComponent } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aComponent],
  imports: [CommonModule, LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aRoutingModule, ComponentsModule],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aModule {}
