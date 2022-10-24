import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoKiemTraTranChiTuBtcRoutingModule } from './so-kiem-tra-tran-chi-tu-btc-routing.module';
import { SoKiemTraTranChiTuBtcComponent } from './so-kiem-tra-tran-chi-tu-btc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [SoKiemTraTranChiTuBtcComponent],
  imports: [CommonModule, SoKiemTraTranChiTuBtcRoutingModule, ComponentsModule],
})
export class SoKiemTraTranChiTuBtcModule {}
