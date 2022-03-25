import { LapDuToanChiNganSachChoDonViComponent } from './lap-du-toan-chi-ngan-sach-cho-don-vi.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapDuToanChiNganSachChoDonViRoutingModule } from './lap-du-toan-chi-ngan-sach-cho-don-vi-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    LapDuToanChiNganSachChoDonViComponent,
  ],
  imports: [
    CommonModule,
    LapDuToanChiNganSachChoDonViRoutingModule,
    ComponentsModule,
  ],
})

export class LapDuToanChiNganSachChoDonViModule {}
