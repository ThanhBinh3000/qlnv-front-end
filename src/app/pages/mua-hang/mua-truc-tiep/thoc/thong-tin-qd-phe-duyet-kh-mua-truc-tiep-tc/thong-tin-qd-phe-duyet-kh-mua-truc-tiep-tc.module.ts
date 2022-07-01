import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { ThongTinQDPheDuyetKhMuaTrucTiepTCRoutingModule } from './thong-tin-qd-phe-duyet-kh-mua-truc-tiep-tc-routing.module';
import { ThongTinQDPheDuyetKhMuaTrucTiepTCComponent } from './thong-tin-qd-phe-duyet-kh-mua-truc-tiep-tc.component';

@NgModule({
  declarations: [ThongTinQDPheDuyetKhMuaTrucTiepTCComponent],
  imports: [
    CommonModule,
    ThongTinQDPheDuyetKhMuaTrucTiepTCRoutingModule,
    ComponentsModule,
  ],
})
export class ThongTinQDPheDuyetKhMuaTrucTiepTCModule {}
