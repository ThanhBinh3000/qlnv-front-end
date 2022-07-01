import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsThongTinMuaTrucTiepTCComponent } from './ds-thong-tin-mua-truc-tiep-tc.component';
import { DsThongTinMuaTrucTiepTCRoutingModule } from './ds-thong-tin-mua-truc-tiep-tc-routing.module';

@NgModule({
  declarations: [DsThongTinMuaTrucTiepTCComponent],
  imports: [
    CommonModule,
    DsThongTinMuaTrucTiepTCRoutingModule,
    ComponentsModule,
  ],
})
export class DsThongTinMuaTrucTiepTCModule {}
