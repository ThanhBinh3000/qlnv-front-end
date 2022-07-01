import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGRoutingModule } from './tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-routing.module';
import { TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent } from './tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent],
  imports: [CommonModule, TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGRoutingModule, ComponentsModule],
  exports:[TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent]
})
export class TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGModule {}
