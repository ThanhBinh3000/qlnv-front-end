import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimKiemBaoCaoThucHienVonPhiHangDTQGRoutingModule } from './tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG-routing.module';
import { TimKiemBaoCaoThucHienVonPhiHangDTQGComponent } from './tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TimKiemBaoCaoThucHienVonPhiHangDTQGComponent],
  imports: [CommonModule, TimKiemBaoCaoThucHienVonPhiHangDTQGRoutingModule, ComponentsModule],
})
export class TimKiemBaoCaoThucHienVonPhiHangDTQGModule {}
