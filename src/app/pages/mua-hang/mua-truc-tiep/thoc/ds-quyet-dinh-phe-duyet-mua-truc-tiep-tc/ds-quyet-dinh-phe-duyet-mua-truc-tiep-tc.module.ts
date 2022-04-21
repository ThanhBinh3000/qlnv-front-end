import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsQuyetDinhMuaTrucTiepTCComponent } from './ds-quyet-dinh-phe-duyet-mua-truc-tiep-tc.component';
import { DsQuyetDinhMuaTrucTiepTCRoutingModule } from './ds-quyet-dinh-phe-duyet-mua-truc-tiep-tc-routing.module';

@NgModule({
  declarations: [DsQuyetDinhMuaTrucTiepTCComponent],
  imports: [
    CommonModule,
    DsQuyetDinhMuaTrucTiepTCRoutingModule,
    ComponentsModule,
  ],
})
export class DsQuyetDinhMuaTrucTiepTCModule {}
